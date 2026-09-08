# Bazaar Basket — Free Delivery Progress + Smart Suggestions

A small MERN prototype built for the Bits and Volts Full Stack MERN Intern task. It's inspired by a real gap I found on the Naik Foods website (naikfoods.co.in), not a copy of it — different name, different branding, and its own demo product catalog.

## Verification Notes

This project was built and statically verified (syntax checks, import/export cross-checks, and the cart math / suggestion ranking logic run standalone against the real seed data) in an environment without package registry access, so `npm install` and a live browser run were not possible from that side. Please run `npm install` for both `client` and `server` as your first step — if anything surfaces, it should be small (a version pin, a missing peer dependency), not a structural issue, since every import/export pair and all backend files have been checked directly.

## Overview

Naik Foods advertises "Free Delivery — Minimum order ₹999" on every page of their site. But that number only ever shows up as a static banner. Nowhere in the shopping flow — not on a product page, not in the cart — does a customer actually see how close they are to it. So someone could easily end up ₹40 short of free delivery without realizing it, or over-order without meaning to.

This project is a working demo of what fixes that: a cart that shows a live progress bar toward the free delivery threshold, tells you exactly how much more you need to spend, and suggests specific products that would close the gap — instead of just leaving you to figure it out.

## Problem Statement

- The ₹999 free delivery threshold is advertised but not tracked anywhere during shopping.
- Customers have no way to know how close they are to qualifying without doing the math themselves at checkout.
- There's no nudge that helps someone reach the threshold — no "add this and you're there" suggestion.

## Solution

A cart experience with:
1. A running subtotal.
2. A progress bar toward ₹999, with the exact rupee amount still needed.
3. A rule-based "smart suggestions" list — products priced close to the remaining amount, pulled live from the database, so a customer can close the gap in one tap.
4. A clear success state once the threshold is crossed.

This is **not** a full clone of Naik Foods, and it does **not** touch their backend, database, or codebase in any way. It's an independent proof of concept using its own catalog.

## Features

- Product catalog fetched from a MongoDB-backed API
- Category filter chips
- Add to cart / increment / decrement / remove
- Live subtotal calculation
- Free delivery progress bar (0 → ₹999)
- "₹X more to unlock free delivery" messaging
- Rule-based product suggestions scoped to the remaining amount
- Success state once ₹999 is reached
- Loading, error, and empty states for both products and cart
- Responsive layout — cart becomes a bottom drawer on mobile

## Tech Stack

**Frontend:** React 18, Vite, plain CSS (no CSS framework), React Context for cart state
**Backend:** Node.js, Express
**Database:** MongoDB (Mongoose)

No Redux, no UI framework, no auth, no payment integration — kept to what the feature actually needs.

## Folder Structure

```
naik-foods-cart-prototype/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartPanel.jsx
│   │   │   ├── FreeDeliveryProgress.jsx
│   │   │   ├── SuggestionList.jsx
│   │   │   └── StateViews.jsx   # loading / error / empty states
│   │   ├── context/
│   │   │   └── CartContext.jsx  # cart state via useReducer + Context
│   │   ├── services/
│   │   │   ├── api.js           # fetch calls to the Express API
│   │   │   └── cartMath.js      # subtotal / remaining / progress math
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── server/                      # Express + MongoDB backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── Product.js
│   │   ├── controllers/
│   │   │   └── productController.js
│   │   ├── routes/
│   │   │   └── products.js
│   │   ├── data/
│   │   │   └── products.json    # demo catalog, original data
│   │   ├── seed/
│   │   │   └── seed.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── REPORT.md                    # full assignment analysis + writeup
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB connection — either local MongoDB or a free MongoDB Atlas cluster

## Installation

Clone or unzip the project, then install both halves separately:

```bash
# Backend
cd server
npm install

# Frontend (in a separate terminal)
cd client
npm install
```

## Environment Variables

**server/.env** (copy from `server/.env.example`):

```
MONGODB_URI=mongodb://127.0.0.1:27017/naik-foods-cart
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
FREE_DELIVERY_THRESHOLD=999
```

**client/.env** (copy from `client/.env.example`):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## MongoDB Setup

**Option A — local MongoDB**
Install MongoDB Community Edition and make sure it's running on `mongodb://127.0.0.1:27017`. The default `MONGODB_URI` in `.env.example` will work as-is.

**Option B — MongoDB Atlas (free tier)**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and password.
3. Under Network Access, allow access from your IP (or `0.0.0.0/0` for testing).
4. Copy the connection string and put it in `server/.env` as `MONGODB_URI`, replacing `<password>` and adding a database name, e.g.:
   ```
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/naik-foods-cart
   ```

## Seeding the Database

Run this once, from the `server` folder, after setting `MONGODB_URI`:

```bash
npm run seed
```

This clears any existing products in the `products` collection and inserts the 20-item demo catalog from `src/data/products.json`.

## Running the Project

**Start the backend** (from `server/`):
```bash
npm run dev
```
This should print `API running on http://localhost:5000`.

**Start the frontend** (from `client/`, in a new terminal):
```bash
npm run dev
```
This should print a local URL, normally `http://localhost:5173`.

Open `http://localhost:5173` in a browser. Add a few products to the cart and watch the progress bar and suggestions update.

## API Endpoints

### `GET /api/health`
Simple health check.
**Response:** `{ "status": "ok" }`

### `GET /api/products`
Returns the full demo catalog, sorted by category then price.
**Response:**
```json
{
  "products": [
    { "_id": "...", "name": "Roasted Makhana Masala", "category": "Snacks", "price": 89, "weight": "100g", "tagline": "...", "imageEmoji": "🍿" }
  ]
}
```

### `GET /api/products/suggestions?remaining=120`
Returns up to 3 products worth suggesting to a customer who needs ₹120 more to reach the free delivery threshold. See "How the suggestion logic works" below.
**Response:**
```json
{
  "suggestions": [
    { "_id": "...", "name": "Millet Chakli", "category": "Snacks", "price": 95, "...": "..." }
  ]
}
```
Returns `400` if `remaining` is missing or not a valid non-negative number.

## How the Suggestion Logic Works

This is rule-based, not machine learning — worth being upfront about that. Given a `remaining` amount:

1. Find products priced at or under `remaining + a buffer` (the buffer is 25% of the remaining amount, minimum ₹30). This means if you need ₹120 more, it will also consider a ₹135 item, because closing the gap in a single add is often more useful than only ever showing items just under the target.
2. Sort those candidates by how close their price is to the remaining amount.
3. Return up to 3, trying to avoid suggesting three items from the same category if better variety is available.

## Deployment

**Frontend → Netlify or Vercel**
1. Push this repo to GitHub (see below).
2. In Netlify/Vercel, create a new site from the GitHub repo.
3. Set the base directory to `client`.
4. Build command: `npm run build`
5. Publish directory: `client/dist`
6. Add an environment variable: `VITE_API_BASE_URL` = your deployed backend URL + `/api` (e.g. `https://your-backend.onrender.com/api`)

**Backend → Render (or any Node host)**
1. Create a new Web Service on [render.com](https://render.com), pointing at this repo.
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `MONGODB_URI`, `PORT` (Render sets this automatically, but you can leave your `.env` default as a fallback), `CLIENT_ORIGIN` (your deployed frontend URL), `FREE_DELIVERY_THRESHOLD`
6. After the first deploy, run the seed script once. Render's free tier doesn't give you a persistent shell by default — the simplest option is to run `npm run seed` locally against the same Atlas `MONGODB_URI` you configured for Render, since it's the same database either way.

**Database → MongoDB Atlas**
Use the same Atlas cluster described in the MongoDB Setup section above for both local development and the deployed backend.

> I'm not able to click through Netlify/Render/GitHub account setup for you — those steps need you to sign in and click through the actual dashboards. Everything on the code side is ready to deploy as-is.

## Screenshots

_Add screenshots here after running the app locally:_

- `docs/screenshot-catalog.png` — product catalog with category filters
- `docs/screenshot-cart-empty.png` — empty cart state
- `docs/screenshot-cart-progress.png` — cart with progress bar and suggestions
- `docs/screenshot-cart-unlocked.png` — free delivery unlocked state
- `docs/screenshot-mobile.png` — mobile drawer view

## Future Improvements

- Persist cart to `localStorage` so a refresh doesn't clear it (skipped here since the assignment scope is a demo, not a production cart)
- Replace emoji placeholders with real (licensed) product photography
- Add a basic checkout summary screen (still no real payment) to show the full flow end to end
- Let the free delivery threshold be configurable from an admin-style settings screen instead of an env variable
- Add unit tests for `cartMath.js` and the suggestion ranking logic

## A Note on Scope

This was built as a 2-day internship task, so it's intentionally narrow: one feature, done properly, rather than a partial e-commerce rebuild. No authentication, no real payments, no admin panel — all explicitly out of scope per the assignment brief.
