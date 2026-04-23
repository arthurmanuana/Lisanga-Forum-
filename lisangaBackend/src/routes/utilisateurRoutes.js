/**
 * @file utilisateurRoutes.js
 * @description Routes utilisateur protégées (profil, update, password)
 * @conforme PDF: Toutes les routes nécessitent JWT. Format réponse standardisé.
 */

import { Router } from 'express';
import * as userController from '../controllers/utilisateurController.js';
import { authenticate } from '../middlewares/auth.js';

import { uploadAvatar } from '../middlewares/upload.js'; // 


const router = Router();

// Protection globale : toutes les routes de ce fichier exigent un token valide
router.use(authenticate);

// GET /api/auth/me → Profil connecté
router.get('/profile', userController.getProfile);

// PUT /api/auth/me → Modification profil
router.put('/me', userController.updateProfile);

// PUT /api/auth/me/password → Changement mot de passe
router.put('/me/password', userController.changePassword);

// Route dédiée à l'upload (multipart/form-data)
router.put('/me/photo', uploadAvatar, userController.updateProfilePhoto);

export default router;
