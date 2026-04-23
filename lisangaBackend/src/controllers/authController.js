/**
 * @file authController.js
 * @description Gestion de l'authentification (Register, Login, Logout, Refresh)
 * @stack Express 5, ESM, bcryptjs, jsonwebtoken, cookie-parser
 * @conforme PDF: Format { data, message } / { error, code, message } | Mapping username/password
 * @note Ce controller suppose que la validation des entrées (Zod) est faite en amont.
 */

import { create, findByEmail, emailExists, findPublicById } from '../models/utilisateurModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// ============================================================================
// ⚙️ HELPERS STANDARDISÉS (Conformes au guide PDF)
// ============================================================================

/**
 * Format d'erreur imposé : { error: true, code: "STRING", message: "..." }
 */
const respondError = (res, status, code, message) => 
  res.status(status).json({ error: true, code, message });

/**
 * Format de succès imposé : {  {...}, message: "..." }
 */
const respondSuccess = (res, status, data = {}, message = 'Opération réussie') => 
  res.status(status).json({ data, message });

// ============================================================================
// 🔑 HELPERS INTERNES
// ============================================================================

/**
 * Génère un couple Access + Refresh Token
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
 * 
 * Frontend envoie: { username, email, password, ... }
 * Backend attend: { nom_utilisateur, email, mot_de_passe, ... }
 */
export const register = async (req, res, next) => {
  try {
    // 🔄 Mapping frontend → backend
    const { username, email, password, nom, prenom, date_de_naissance, sexe } = req.body;
    
    // Utiliser username comme nom_utilisateur, ou le séparer en nom/prenom si fourni
    const nom_utilisateur = username;
    const finalNom = nom || username?.split('_')?.[1] || username || 'Utilisateur';
    const finalPrenom = prenom || username?.split('_')?.[0] || 'Utilisateur';

    // Vérification d'existence
    const alreadyExists = await emailExists(email);
    if (alreadyExists) {
      return respondError(res, 409, 'EMAIL_ALREADY_EXISTS', 'Un compte avec cet email existe déjà');
    }

    // Hash sécurisé
    const hashedPassword = await bcrypt.hash(password, 10);

    // Délégation au Model (avec les noms de champs backend)
    const result = await create({
      nom: finalNom,
      prenom: finalPrenom,
      email,
      mot_de_passe: hashedPassword,
      nom_utilisateur,
      date_de_naissance: date_de_naissance || null,
      sexe: sexe || null
    });

    if (!result.success) {
      // Mapper les erreurs du model vers les codes frontend attendus
      if (result.error?.includes('email')) {
        return respondError(res, 409, 'EMAIL_ALREADY_EXISTS', result.error);
      }
      if (result.error?.includes('nom d\'utilisateur') || result.error?.includes('pseudo')) {
        return respondError(res, 409, 'USERNAME_ALREADY_EXISTS', result.error);
      }
      return respondError(res, 400, 'VALIDATION_ERROR', result.error);
    }

    const user = result.user;
    const { accessToken, refreshToken } = generateTokens(user.id_utilisateurs, user.role);

    // Refresh token en cookie sécurisé
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    // ✅ Réponse conforme au guide PDF
    respondSuccess(res, 201, {
      userId: user.id_utilisateurs,
      accessToken
    }, 'Inscription réussie ! Vous pouvez maintenant vous connecter.');

  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Vérifie les identifiants, retourne les tokens si OK
 * 
 * Frontend envoie: { email, password }
 * Backend compare avec: email, mot_de_passe (hashé)
 */
export const login = async (req, res, next) => {
  try {
    // 🔄 Mapping : frontend envoie "password"
    const { email, password } = req.body;

    // Récupération de l'utilisateur (inclut le hash pour comparaison)
    const user = await findByEmail(email);
    if (!user) {
      // Message générique pour éviter l'énumération d'utilisateurs
      return respondError(res, 401, 'AUTH_INVALID_CREDENTIALS', 'Email ou mot de passe incorrect');
    }

    // Comparaison du hash (password frontend vs mot_de_passe backend)
    const isMatch = await bcrypt.compare(password, user.mot_de_passe);
    if (!isMatch) {
      return respondError(res, 401, 'AUTH_INVALID_CREDENTIALS', 'Email ou mot de passe incorrect');
    }

    // Génération & envoi des tokens
    const { accessToken, refreshToken } = generateTokens(user.id_utilisateurs, user.role);
    res.cookie('refreshToken', refreshToken, getCookieOptions());
    
    // 🔄 Mapping réponse : backend → frontend (format exact du guide)
    const userResponse = {
      id: user.id_utilisateurs,
      username: user.nom_utilisateur || `${user.prenom}_${user.nom}`,
      email: user.email,
      role: user.role,
      avatarUrl: user.photo || null,
      createdAt: user.created_at
    };

    respondSuccess(res, 200, {
      accessToken,
      user: userResponse
    }, 'Connexion réussie');

  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Supprime le cookie refresh token
 */
export const logout = (req, res) => {
  res.clearCookie('refreshToken', getCookieOptions());
  respondSuccess(res, 200, {}, 'Déconnexion réussie');
};

/**
 * POST /api/auth/refresh
 * Génère un nouveau access token si le refresh token est valide
 * 
 * Note: Le refresh token contient { id }, pas email → utiliser findPublicById(decoded.id)
 */
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return respondError(res, 401, 'AUTH_TOKEN_MISSING', 'Refresh token manquant');
    }

    // Vérification du refresh token
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    
    // ✅ Correction : utiliser decoded.id (le token ne contient que l'ID)
    const user = await findPublicById(decoded.id);
    if (!user) {
      return respondError(res, 403, 'AUTH_USER_NOT_FOUND', 'Utilisateur invalide');
    }

    const { accessToken } = generateTokens(user.id_utilisateurs, user.role);
    
    respondSuccess(res, 200, { accessToken }, 'Token rafraîchi');

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return respondError(res, 401, 'AUTH_TOKEN_EXPIRED', 'Refresh token expiré');
    }
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenError') {
      return respondError(res, 403, 'AUTH_TOKEN_INVALID', 'Refresh token invalide');
    }
    next(err);
  }
};