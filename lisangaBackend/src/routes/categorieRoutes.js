import { Router } from 'express';
import {
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    deleteCategorie,
} from '../controllers/categorieController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/role.js';

const router = Router();

// Routes publiques
router.get('/', getAllCategories);
router.get('/:id', getCategorieById);

// Routes admin uniquement
router.post('/', authenticate, authorizeRoles('admin'), createCategorie);
router.put('/:id', authenticate, authorizeRoles('admin'), updateCategorie);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteCategorie);

export default router;
