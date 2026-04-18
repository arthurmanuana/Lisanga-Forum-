import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "lisanga-api",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "NotFound",
    code: 404,
    message: `Route ${req.method} ${req.originalUrl} introuvable`,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Lisanga API démarrée sur http://localhost:${PORT}`);
});