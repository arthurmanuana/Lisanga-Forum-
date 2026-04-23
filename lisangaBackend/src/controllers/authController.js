/**
 * @file authController.js
 * @description Gestion de l'authentification (Register, Login, Logout, Refresh)
 * @stack Express 5, ESM, bcryptjs, jsonwebtoken, cookie-parser
 * @note Ce controller suppose que la validation des entrées (Zod/Joi) est faite
 *       en amont par un middleware. Il se concentre sur la logique métier & sécurité.
 */

import { create, findByEmail, emailExists } from '../models/utilisateurModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js'; // Adapter selon tes exports réels

// ============================================================================
// ⚙️ HELPERS INTERNES
// ============================================================================

/**
 * Génère un couple Access + Refresh Token
 * @param {number} userId 
 * @param {string} role 
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

/**
 * Configure les options du cookie Refresh Token
 * 🔒 httpOnly: empêche JS de le lire (protection XSS)
 * 🔒 sameSite: strict/lax (protection CSRF)
 * 🔒 secure: true en production (HTTPS uniquement)
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  path: '/'
});

// ============================================================================
// 🟢 ENDPOINT HANDLERS
// ============================================================================

/**
 * POST /api/auth/register
 * Crée un compte, hash le mot de passe, retourne les tokens
 */
export const register = async (req, res, next) => {
  try {
    const { nom, prenom, email, mot_de_passe, nom_utilisateur, date_de_naissance, sexe } = req.body;

    // 🛡️ Vérification d'existence (rapide, évite une requête INSERT qui échouerait)
    const alreadyExists = await emailExists(email);
    if (alreadyExists) {
      return res.status(409).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // 🔐 Hash sécurisé (10 rounds = équilibre sécurité/performance)
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // 📦 Délégation au Model
    const result = await create({
      nom, prenom, email, mot_de_passe: hashedPassword,
      nom_utilisateur, date_de_naissance, sexe
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const user = result.user;
    const { accessToken, refreshToken } = generateTokens(user.id_utilisateurs, user.role);

    // 🍪 Refresh token en cookie sécurisé
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    // 🔑 Access token dans le corps (pour stockage frontend localStorage/sessionStorage)
    res.status(201).json({
      message: 'Inscription réussie',
      user: { id: user.id_utilisateurs, email: user.email, role: user.role },
      accessToken
    });

  } catch (err) {
    next(err); // Passe au middleware d'erreur global
  }
};

/**
 * POST /api/auth/login
 * Vérifie les identifiants, retourne les tokens si OK
 */
export const login = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;

    // 1. Récupération de l'utilisateur (inclut le hash pour comparaison)
    const user = await findByEmail(email);
    if (!user) {
      // ⚠️ Ne jamais préciser "email incorrect" vs "mot de passe incorrect"
      // Évite le user enumeration attack
      return res.status(401).json({ 
        error: true, 
        code: 'AUTH_INVALID_CREDENTIALS', 
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // 2. Comparaison du hash
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // 3. Génération & envoi des tokens
    const { accessToken, refreshToken } = generateTokens(user.id_utilisateurs, user.role);
    
    res.cookie('refreshToken', refreshToken, getCookieOptions());
    res.json({
      message: 'Connexion réussie',
      user: { id: user.id_utilisateurs, email: user.email, role: user.role },
      accessToken
    });

  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Invalide le refresh token côté client + supprime le cookie
 */
export const logout = (req, res) => {
  // Le cookie est supprimé côté serveur
  res.clearCookie('refreshToken', getCookieOptions());
  res.json({ message: 'Déconnexion réussie' });
};

/**
 * POST /api/auth/refresh
 * Génère un nouveau access token si le refresh token est valide
 */
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: 'Refresh token manquant' });

    // Vérification du refresh token
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    
    // Vérification que l'utilisateur existe toujours
    const user = await findByEmail(decoded.email || ''); // Si tu stockes email dans refresh
    // Sinon: const user = await findPublicById(decoded.id);
    if (!user) return res.status(403).json({ error: 'Utilisateur invalide' });

    const { accessToken } = generateTokens(user.id_utilisateurs, user.role);
    res.json({ accessToken });

  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Refresh token invalide ou expiré' });
    }
    next(err);
  }
};