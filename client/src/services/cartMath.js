export const FREE_DELIVERY_THRESHOLD = 999;

/**
 * All prices in this prototype are whole rupees (no paise), so every value
 * here stays an integer. That sidesteps the classic 0.1 + 0.2 !== 0.3
 * floating point problem entirely instead of trying to round it away later.
 */

export function getSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getRemaining(subtotal, threshold = FREE_DELIVERY_THRESHOLD) {
  return Math.max(threshold - subtotal, 0);
}

export function getProgressPercent(subtotal, threshold = FREE_DELIVERY_THRESHOLD) {
  if (threshold <= 0) return 100;
  const pct = (subtotal / threshold) * 100;
  return Math.min(Math.max(pct, 0), 100);
}

export function hasFreeDelivery(subtotal, threshold = FREE_DELIVERY_THRESHOLD) {
  return subtotal >= threshold;
}
