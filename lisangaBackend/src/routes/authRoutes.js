/**
 * @file authRoutes.js
 * @description Portes d'entrée pour l'authentification
 * @note Les routes publiques ne demandent pas de connexion.
 *       Les routes protégées (logout/refresh) lisent automatiquement le cookie refreshToken.
 */

import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = Router();







// Routes publiques (inscription & connexion)
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Routes nécessitant un cookie refreshToken présent
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

export default router;