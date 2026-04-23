import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";

import authRoutes from './routes/authRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
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

app.get("/api/health/db", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW() AS now");
    res.json({
      status: "ok",
      database: "connected",
      serverTime: rows[0].now,
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message: err.message,
    });
  }
});

// 📍 Montage des routes API
app.use('/api/auth', authRoutes);          // 🔓 Inscription / Connexion / Refresh
app.use('/api/users', utilisateurRoutes);  // 🔒 Profil / Update / Password

// ... (routes admin & articles à venir)

app.use((req, res) => {
  res.status(404).json({
    error: "NotFound",
    code: 404,
    message: `Route ${req.method} ${req.originalUrl} introuvable`,
  });
});

app.use((err, req, res, _next) => {
  console.error("💥 Erreur non gérée :", err);
  res.status(err.status || 500).json({
    error: err.name || "InternalServerError",
    code: err.status || 500,
    message: err.message || "Une erreur inattendue est survenue",
  });
});

app.listen(env.PORT, () => {
  console.log(`✅ Lisanga API démarrée sur http://localhost:${env.PORT}`);
});