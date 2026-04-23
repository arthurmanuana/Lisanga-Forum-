/**
 * @file adminRoutes.js
 * @description Routes administrateur protégées (stats + CRUD catégories)
 * @conforme PDF: ENDPOINT 6 + gestion catégories | Protection JWT + rôle admin
 */

import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/role.js';
import { validate } from '../middlewares/validate.js';
import { categorySchema } from '../schemas/adminSchema.js';

const router = Router();

// Double protection globale : JWT valide + role admin
router.use(authenticate);
router.use(authorizeRoles('admin'));

// Stats enrichies
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);

// CRUD Categories
router.get('/categories', adminController.getCategories);
router.post('/categories', validate(categorySchema.create), adminController.createCategory);
router.put('/categories/:id', validate(categorySchema.update), adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

export default router;