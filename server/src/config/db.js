import mongoose from "mongoose";

/**
 * Connects to MongoDB using the URI from the environment.
 * Kept as its own module so index.js and the seed script can both use it
 * without duplicating connection logic.
 */
export async function connectDB(uri) {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env and fill it in."
    );
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  await mongoose.connect(uri, {
    // These are the sane defaults for mongoose 8, kept explicit so the
    // behaviour doesn't silently change on a driver upgrade.
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
