/**
 * @file adminRoutes.js
 * @description Routes réservées aux administrateurs
 * @conforme PDF: ENDPOINT 6 | Protection JWT + Rôle admin obligatoire
 */

import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/role.js';

const router = Router();

// Double protection :
// 1. L'utilisateur doit être connecté (JWT valide)
// 2. Son rôle DOIT être 'admin'
router.use(authenticate);
router.use(authorizeRoles('admin'));

// GET /api/admin/stats
router.get('/stats', adminController.getStats);

// Lister tous les utilisateurs
router.get('/users', adminController.getUsers);

// Exemple de future route (décommenter quand prête) :
// router.delete('/users/:id', adminController.deleteUser);
// router.put('/articles/:id/moderate', adminController.moderateArticle);

export default router;