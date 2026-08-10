import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import libraryRoutes from "./routes/library.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

app.use("/api/library", libraryRoutes);

app.use("/api/profile", profileRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "WatchReadLibrary API працює!" });
});

app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Маршрут ${req.method} ${req.url} не знайдений.` });
});

app.listen(PORT, () => {
  console.log(`Сервер запущений на http://localhost:${PORT}`);
  console.log(`API доступний на http://localhost:${PORT}/api`);
});
