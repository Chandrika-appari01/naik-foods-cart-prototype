import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  const raw = await fs.readFile(
    path.join(__dirname, "..", "data", "products.json"),
    "utf-8"
  );
  const products = JSON.parse(raw);

  await Product.deleteMany({});
  const created = await Product.insertMany(products);

  console.log(`Seeded ${created.length} demo products.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
