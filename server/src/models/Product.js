import mongoose from "mongoose";

/**
 * Demo product catalog schema. This is intentionally simple — it models
 * only what the prototype actually uses (listing, cart math, and the
 * suggestion query), not a full commerce catalog.
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      // Stored as an integer number of rupees to avoid floating point
      // rounding issues when we do cart math (see cartMath.js on the client).
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: String, // e.g. "100g" — display only, not used in calculations
      default: "",
    },
    tagline: {
      type: String,
      default: "",
    },
    imageEmoji: {
      // The prototype uses emoji instead of real product photography so we
      // never touch Naik Foods' actual images or any other copyrighted assets.
      type: String,
      default: "🍽️",
    },
  },
  { timestamps: true }
);

productSchema.index({ price: 1 });
productSchema.index({ category: 1 });

export const Product = mongoose.model("Product", productSchema);
