# Full Stack MERN Intern Task

**Submitted for:** Bits and Volts Private Limited
**Website studied:** [naikfoods.co.in/in](https://www.naikfoods.co.in/in)

---

## 1. Introduction

For this task I studied the live Naik Foods website as both a shopper and as a developer, and picked one improvement to actually build as a working MERN prototype rather than just describe. This document covers what I found on the site, why I think it matters, and how the prototype addresses one of those findings.

I want to be upfront about method: everything in Section 5 comes from pages I actually opened and inspected on the live site. Where I couldn't fully verify something (like account/reorder behavior that needs a login, or blog post bodies I didn't open individually), I've said so instead of presenting it as confirmed fact.

## 2. Website Studied

Naik Foods (naikfoods.co.in) is a Pune-based e-commerce store selling Maharashtrian regional food — snacks, pickles, sweets, spices, dairy/beverages, and mukhvas. The site is built on Next.js, with product images served through Cloudinary and payments through Razorpay. The image URL naming pattern (`medusa/...`) suggests the commerce backend is Medusa.js, though I can't confirm that without access to their actual stack.

## 3. User Perspective Analysis

Shopping the site as a customer would:

- The homepage is visually clean and does a good job introducing the brand — banners, featured categories, bestsellers, and a "10% off" offer are all above the fold.
- Getting from homepage to a specific product works fine if you're browsing by category. It gets slower once you already know what you want, because there's no search bar anywhere in the header.
- The product page for Beetroot Chips (the one I opened in detail) has a photo, price, weight, and 56 reviews shown — but the actual product description is mostly repeated marketing phrases ("guilt-free snacking," "on-the-go crunchy bite") rather than facts like ingredients or shelf life.
- The site repeatedly tells you free delivery kicks in above ₹999, but I never saw that number tracked anywhere while actually shopping — not on the product page, and I wasn't able to add an item to test the live cart view since that page renders client-side.
- The brand's actual story — an 80-year-old family business, a grandmother's recipes — is genuinely interesting, but it's tucked away on the About page and doesn't show up while you're browsing products.

## 4. Developer Perspective Analysis

Looking at the site from a build/architecture angle:

- It's a modern Next.js site with image optimization already in place (`_next/image` with width/quality params), which is a solid technical foundation.
- Category and store pages are server-rendered with the product grid, but interactive pieces like the cart, filters sidebar, and sort dropdown are client-rendered, so I could see them exist but not fully test their behavior through a static fetch.
- Two products on the store listing page display ₹0 as their price. That's either a data entry issue in the catalog or a bug in how price is being read/displayed for those specific items — I can't tell which without backend access, but it's visibly wrong on the live site right now.
- One PDP I checked had a variant selector showing placeholder text ("Select Default option") instead of an actual label, which suggests either a missing product option name in the catalog or a fallback string that's supposed to be replaced and isn't.
- No structured product data (ingredients, allergens, shelf life, FSSAI number) appeared on the product page I opened — this is a data/schema gap worth flagging for a food e-commerce site specifically.

## 5. Key Findings

### Finding 1 — No search across the catalog
**What I noticed:** The header only has Home / About / Shop / Blogs / Contact plus Account/Wishlist/Cart icons. No search bar or icon. The store page paginates 12 products at a time across 10 pages (115 products total).
**Why it matters:** A customer who already knows what they want has to browse by category and page through results instead of just typing the name.
**Recommended improvement:** Add a search bar with basic name/tag matching and autocomplete.
**Technical approach:** MongoDB text index on product name/tags, an Express search endpoint, debounced React input.
**Priority:** High
**Expected impact:** Product discovery for intent-driven shoppers.

### Finding 2 — Two products show ₹0
**What I noticed:** "Aaswad Mitha Paan" and "Shahi Mukhwas" both display ₹0 on the store listing, while every other product has a real price.
**Why it matters:** This looks like a live pricing/data bug. At minimum it's confusing; at worst someone could try to check out a free item.
**Recommended improvement:** Audit the catalog for zero or missing prices.
**Technical approach:** This is a data-layer fix on their side — I flagged it rather than guessing at their admin tooling, since I don't have backend access.
**Priority:** High
**Expected impact:** Data integrity, prevents a possible checkout exploit.

### Finding 3 — Product pages are missing ingredients, allergens, and shelf-life info
**What I noticed:** The Beetroot Chips PDP has five sections of marketing copy but no ingredients list, no allergen warning, no shelf life, and no FSSAI license number.
**Why it matters:** This is food. Someone with an allergy, or checking for preservatives, has no way to check before ordering.
**Recommended improvement:** Add a structured "Ingredients & Nutrition" section on every product page.
**Technical approach:** A `nutrition` sub-document on the product schema (ingredients array, allergens array, shelf life, FSSAI number), rendered as a collapsible section.
**Priority:** High
**Expected impact:** Trust, regulatory compliance, fewer pre-purchase support questions.

### Finding 4 — Placeholder text left in the variant selector
**What I noticed:** The Beetroot Chips PDP's option selector reads "Select Default option" / "Default option value" instead of a real label.
**Why it matters:** Reads as unfinished, and probably shows up on other product pages that use the same variant pattern.
**Recommended improvement:** Replace default/placeholder labels with real option names at the catalog level.
**Priority:** Medium
**Expected impact:** Perceived polish, fewer wrong-size/variant orders.

### Finding 5 — The ₹999 free-delivery threshold isn't visible while shopping
**What I noticed:** "Free Delivery — Minimum order ₹999" is shown in the trust strip on every page, but there's no live progress or running total shown on the product page, and I wasn't able to verify it inside the actual cart page since it renders client-side.
**Why it matters:** Most items are ₹30–₹280, so it likely takes 3–5 items to hit ₹999. A shopper has no way to tell how close they are without doing the math themselves.
**Recommended improvement:** Show a progress indicator toward ₹999 in the cart, with specific low-cost item suggestions to close the gap.
**Technical approach:** Track subtotal in cart state, compare to the threshold, call a suggestions endpoint filtered by remaining budget.
**Priority:** High
**Expected impact:** Average order value — this is the finding the prototype is built around.

### Finding 6 — The brand's heritage story never reaches the shopping pages
**What I noticed:** The About page has a strong, specific story (family business since 1938, recipes from "Aaji"). None of that appears on product or category pages, which instead use generic template-style bullet copy.
**Why it matters:** For a brand selling "authentic homemade" food, the founder story is a real differentiator that isn't being used where it would actually influence a purchase decision.
**Recommended improvement:** Pull a short, specific line from the brand story into relevant categories — pickles especially, since the homepage banner already references "Aaji's Recipe."
**Priority:** Medium
**Expected impact:** Trust and differentiation, especially for unfamiliar regional products.

### Finding 7 — Blog content isn't visibly linked to products
**What I noticed:** Blog post titles ("10 Healthy & Crunchy Snack Products You Must Try," "10 Delicious Upwas Snacks You Must Try During Fasting") are directly relevant to the catalog, but the blog listing page shows no product links or "shop this" CTAs.
**Why it matters:** These post titles look written for search traffic already — not connecting them to the shop is a likely missed conversion path.
**What needs verification:** I only opened the blog listing page, not individual post bodies, so I can't confirm whether the posts themselves link to products internally. This needs a manual check before treating it as a confirmed gap.
**Recommended improvement:** If not already present, add inline product links inside blog post content.
**Priority:** Medium
**Expected impact:** SEO-to-purchase conversion.

### Finding 8 — Reorder/"buy again" behavior is unverified
**What I noticed:** Account and Wishlist icons exist in the header, but checking one-click reorder requires being logged in with order history, which I couldn't do without an account.
**Why it matters:** For a snacks/pickles brand, repeat purchase is likely a bigger revenue lever than first-time discovery. If reordering takes more than one or two steps, that's a retention gap.
**What needs verification:** Whether this feature exists at all — flagging this as an opportunity to check, not a confirmed missing feature.
**Priority:** Medium (pending verification)
**Expected impact:** Repeat purchase rate.

### Finding 9 — Product recommendations don't look personalized to what you're viewing
**What I noticed:** On the Beetroot Chips page, the "Featured Products" section below showed Corn Chakali and Thepla Puri — reasonable picks, but nothing suggested they were chosen because they pair with beetroot chips specifically versus just being generally popular.
**Why it matters:** For a food store, "frequently bought together" or "pairs well with" suggestions are a natural way to raise order value, and this doesn't look like it's currently in use — though I can't see the actual recommendation logic behind the scenes, so this is an inference based on what displayed.
**Recommended improvement:** Tag products with simple pairing relationships and surface those instead of, or alongside, generic featured items.
**Priority:** Low
**Expected impact:** Average order value, cross-category discovery.

### Finding 10 — Homepage testimonials can't be independently verified
**What I noticed:** Six testimonials with names and Instagram/Google handles appear on the homepage, with fairly similar-sounding copy across all six.
**Why it matters:** I'm not claiming these are fake — I have no way to check. But if they're not sourced from actual verified orders, that's worth knowing internally, since it's a trust risk once real customers start comparing notes.
**Recommended improvement:** If not already the case, source testimonials from verified orders and link to the original review where possible.
**Priority:** Low
**Expected impact:** Trust/credibility.

## 6. Other Improvement Opportunities

A few additional thoughts, clearly separated by how confident I am in them:

- **Search (confirmed missing, Finding 1)** — the single most concrete gap I found, since it's a simple presence/absence check, not something I had to infer.
- **Product information quality (confirmed on the page I checked, Finding 3)** — I'd want to spot-check a few more product pages before assuming every single one has this gap, but the one I opened was clear.
- **Catalog data quality (confirmed, Finding 2)** — the ₹0 pricing bug is directly observable.
- **Brand storytelling (confirmed contrast, Finding 6)** — the About page content exists and is strong; it's the lack of reuse elsewhere that's the gap.
- **Blog-to-product linking (needs verification, Finding 7)** — plausible based on the listing page, not confirmed at the post level.
- **Repeat purchasing (needs verification, Finding 8)** — couldn't check without an account.
- **Product pairing/bundling (inference, Finding 9)** — based on what displayed, not on knowledge of their actual recommendation logic.

## 7. Selected Feature

I chose to build the **free delivery progress + smart suggestions** feature (Finding 5) over the other two candidates I considered — a search bar, and a structured nutrition/ingredients section.

Search is the more "expected" pick for an e-commerce prototype, but it's also the most generic — almost every store-clone project includes a search bar. The free-delivery nudge is tied to something specific Naik Foods is already doing (advertising a ₹999 threshold on every page) without following through on it anywhere in the actual shopping flow. Building this shows I read their site specifically, rather than defaulting to "e-commerce site → needs search." It also exercises a good spread of the stack for a 2-day task: real cart state on the frontend, a genuine database query on the backend, and a UI piece that's simple enough to build cleanly instead of half-finishing something bigger.

## 8. Prototype

**Problem:** The ₹999 free delivery threshold is advertised but never tracked while shopping.

**Solution:** A cart that shows a live progress bar toward ₹999, the exact amount remaining, and specific product suggestions priced to help close that gap — all backed by a real Express + MongoDB API, not hardcoded values.

**User flow:**
1. Browse the demo catalog, filter by category, add items to cart.
2. Open the cart (sidebar on desktop, bottom drawer on mobile).
3. See the subtotal, the progress bar, and "₹X more to unlock free delivery."
4. See 1–3 suggested products priced to help close that gap, pulled live from the suggestions API.
5. Add a suggestion directly from the cart.
6. Once the subtotal reaches ₹999, the progress bar fills and a success message replaces the "add more" prompt.

**Screens:** One main screen — a catalog view with a persistent cart panel — since the feature itself is about the cart, not a multi-page flow.

**Expected benefit:** More visible pressure/support toward reaching a threshold customers are already told exists, which should reduce close-but-not-quite baskets and nudge average order value upward. I'm not claiming a specific percentage improvement — I don't have real usage data to back a number, so I'm not going to invent one.

## 9. Technical Architecture

```mermaid
flowchart LR
    A[React + Vite Frontend] -->|fetch /api/products| B[Express API]
    A -->|fetch /api/products/suggestions| B
    B -->|Mongoose queries| C[(MongoDB)]
    B -->|JSON responses| A
```

The frontend never talks to MongoDB directly — all data passes through the Express API, which is the only thing that holds the database connection string.

## 10. Database Design

Single collection: **products**

| Field | Type | Why it exists |
|---|---|---|
| `name` | String | Product display name |
| `category` | String | Used for the filter chips and suggestion category-diversity check |
| `price` | Number (integer rupees) | Core value for cart math and the suggestion query |
| `weight` | String | Display only (e.g. "100g") |
| `tagline` | String | Short description shown on the product card |
| `imageEmoji` | String | Stand-in for a product photo, since the prototype uses no real Naik Foods or copyrighted imagery |
| `createdAt` / `updatedAt` | Date (auto) | Standard Mongoose timestamps |

One collection was enough here — a cart is not persisted server-side in this prototype (it lives in React state on the client), so there's no need for a `carts` or `orders` collection for what this demo is actually showing.

## 11. API Documentation

### `GET /api/health`
Health check.
**Response:** `{ "status": "ok" }`

### `GET /api/products`
Returns the full demo catalog, sorted by category then price.
**Response:** `{ "products": [ { "_id", "name", "category", "price", "weight", "tagline", "imageEmoji" }, ... ] }`

### `GET /api/products/suggestions?remaining=<number>`
Returns up to 3 products worth suggesting to a customer who needs `remaining` more rupees to hit the free delivery threshold. Rule-based, not ML — ranks by price closeness to `remaining` within a small buffer, with a light preference for category variety.
**Response:** `{ "suggestions": [ {...product}, ... ] }`
**Errors:** `400` if `remaining` is missing, negative, or not a number.

## 12. Technologies Used

- React 18 + Vite (frontend)
- Plain CSS with custom properties for theming (no Tailwind/Bootstrap)
- React Context + `useReducer` for cart state (no Redux — not needed at this scope)
- Node.js + Express (backend)
- MongoDB + Mongoose (database)
- `cors` and `dotenv` as the only backend dependencies beyond Express/Mongoose

## 13. Setup Instructions

See `README.md` for full details. Short version:

```bash
cd server && npm install && cp .env.example .env
cd ../client && npm install && cp .env.example .env
```

## 14. Running the Project

```bash
# Terminal 1 — backend
cd server
npm run seed   # run once, or whenever you want to reset demo data
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

Then open `http://localhost:5173`.

## 15. Deployment Instructions

Full step-by-step is in `README.md` under "Deployment." Short version:
- **Frontend:** Netlify/Vercel, base directory `client`, build command `npm run build`, publish directory `client/dist`.
- **Backend:** Render (or similar), root directory `server`, build command `npm install`, start command `npm start`.
- **Database:** MongoDB Atlas free tier, same connection string used for both local dev and the deployed backend.

## 16. Screenshots

_To be added after running the app locally — see the Screenshots section in `README.md` for the exact filenames expected._

## 17. Future Improvements

- Persist the cart to `localStorage` so a page refresh doesn't clear it
- Add a basic (still fake) checkout summary screen to show the full flow end to end
- Replace emoji placeholders with real, licensed product photography
- Add automated tests for the cart math and suggestion ranking functions
- Make the ₹999 threshold configurable from a settings screen instead of an env variable

## 18. Conclusion

The biggest thing I took away from actually studying the site instead of guessing at generic e-commerce improvements is that Naik Foods already has good bones — a real brand story, decent product photography, a modern frontend stack — but a few specific, fixable gaps (no search, a live pricing bug, missing food-safety info, and an unused free-delivery incentive) are quietly costing them conversions and trust. I picked the free-delivery gap to build because it was the most concrete "they're already telling customers this exists, but not showing it" problem I found, and it was realistic to build properly in the time I had rather than rebuilding a slice of their whole site.
