/**
 * @file utilisateurRoutes.js
 * @description Routes utilisateur protégées (profil, update, password)
 * @conforme PDF: Toutes les routes nécessitent JWT. Format réponse standardisé.
 */

import { Router } from 'express';
import * as userController from '../controllers/utilisateurController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// 🔒 Protection globale : toutes les routes de ce fichier exigent un token valide
router.use(authenticate);

// 📥 GET /api/users/me → Profil connecté
router.get('/me', userController.getProfile);

// ✏️ PUT /api/users/me → Modification profil
router.put('/me', userController.updateProfile);

// 🔐 PUT /api/users/me/password → Changement mot de passe
router.put('/me/password', userController.changePassword);

export default router;