import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/products.js";

const app = express();
const PORT = process.env.PORT || 5000;
// Trim a trailing slash so a value like "https://foo.netlify.app/" in the
// env var still matches the Origin header the browser actually sends
// ("https://foo.netlify.app", no trailing slash) — otherwise CORS fails
// silently and it's a confusing thing to debug after deployment.
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || "http://localhost:5173").replace(/\/$/, "");

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productRoutes);

// Basic error handler so a thrown/rejected error doesn't crash the process
// or leak a stack trace to the client.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
