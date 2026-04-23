import { Router } from 'express';
import {
    getCommentsByArticleId,
    getRepliesByCommentId,
    getCommentById,
    createComment,
    deleteComment,
    getCommentsByUserId,
} from '../controllers/commentaireController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Routes publiques
router.get('/article/:articleId', getCommentsByArticleId);
router.get('/user/:userId', getCommentsByUserId);
router.get('/:id/replies', getRepliesByCommentId);
router.get('/:id', getCommentById);

// Routes protegees
router.post('/', authenticate, createComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
