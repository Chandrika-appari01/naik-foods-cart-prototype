import { Product } from "../models/Product.js";

/**
 * GET /api/products
 * Returns the full demo catalog. No pagination since the demo catalog is
 * intentionally small (20 items) — a real catalog of 100+ items would need it.
 */
export async function listProducts(req, res) {
  const products = await Product.find().sort({ category: 1, price: 1 });
  res.json({ products });
}

/**
 * GET /api/products/suggestions?remaining=120
 *
 * Rule-based (not ML) suggestion logic for the "add a bit more to unlock
 * free delivery" prompt. Given how much rupee value is left before the
 * customer hits the free delivery threshold, this returns products that
 * make sense to suggest.
 *
 * The ranking rule, in plain terms:
 *   1. Only suggest products that are AFFORDABLE relative to the gap —
 *      specifically, priced at or under (remaining + a small buffer).
 *      The buffer exists because "you need ₹120 more" shouldn't only ever
 *      surface a ₹115 item — a ₹135 item that closes the gap in one add
 *      is often more useful than three ₹40 items.
 *   2. Among those, prefer products CLOSEST to the remaining amount,
 *      because that gets the customer to the threshold in the fewest
 *      additional clicks.
 *   3. Cap suggestions to 3 products and try not to return three items
 *      from the same category, so it doesn't look like a random price sort.
 */
export async function suggestProducts(req, res) {
  const remaining = Number(req.query.remaining);

  if (!Number.isFinite(remaining) || remaining < 0) {
    return res.status(400).json({
      error: "Query param 'remaining' must be a non-negative number.",
    });
  }

  // Nothing left to add — customer already qualifies for free delivery.
  if (remaining === 0) {
    return res.json({ suggestions: [] });
  }

  const buffer = Math.max(30, Math.round(remaining * 0.25));
  const priceCeiling = remaining + buffer;

  const candidates = await Product.find({ price: { $lte: priceCeiling } })
    .sort({ price: 1 })
    .lean();

  if (candidates.length === 0) {
    return res.json({ suggestions: [] });
  }

  // Sort candidates by how close their price is to the remaining amount.
  const byCloseness = [...candidates].sort(
    (a, b) => Math.abs(a.price - remaining) - Math.abs(b.price - remaining)
  );

  const suggestions = [];
  const usedCategories = new Set();

  for (const product of byCloseness) {
    if (suggestions.length >= 3) break;
    if (usedCategories.has(product.category) && suggestions.length < 3) {
      // Allow a repeat category only if we're running out of candidates.
      const remainingCandidates = byCloseness.filter(
        (p) => !suggestions.find((s) => s._id.equals(p._id))
      );
      const hasFreshCategory = remainingCandidates.some(
        (p) => !usedCategories.has(p.category)
      );
      if (hasFreshCategory) continue;
    }
    suggestions.push(product);
    usedCategories.add(product.category);
  }

  res.json({ suggestions });
}
