/**
 * @file authRoutes.js
 * @description Portes d'entrée pour l'authentification + alias profil (conforme guide PDF)
 * @note Les routes publiques ne demandent pas de connexion.
 *       Les routes protégées lisent automatiquement le token via le middleware.
 * @conforme PDF: GET /api/auth/profile exigé par le frontend
 */

import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/utilisateurController.js'; // 🆕 Pour l'alias profil
import { authenticate } from '../middlewares/auth.js'; // ✅ Vérifie que le dossier s'appelle bien "middlewares"
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = Router();

// ============================================================================
// 🔓 Routes publiques (aucune auth requise)
// ============================================================================

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * POST /api/auth/login
 * Connexion avec email + mot de passe
 */
router.post('/login', validate(loginSchema), authController.login);

// ============================================================================
// 🔒 Routes protégées (nécessitent un token valide)
// ============================================================================

/**
 * POST /api/auth/logout
 * Supprime le cookie refresh token
 */
router.post('/logout', authenticate, authController.logout);

/**
 * POST /api/auth/refresh
 * Génère un nouveau access token depuis le refresh token
 */
router.post('/refresh', authenticate, authController.refresh);

// ============================================================================
// ✅ ALIAS CONFORME AU GUIDE PDF
// ============================================================================

/**
 * GET /api/auth/profile
 * Récupère le profil de l'utilisateur connecté
 * 
 * @note Cette route est un alias vers userController.getProfile
 *       Elle permet de respecter le contrat frontend: GET /api/auth/profile
 *       Tout en gardant la logique utilisateur dans utilisateurController.js
 */
router.get('/profile', authenticate, userController.getProfile);

export default router;