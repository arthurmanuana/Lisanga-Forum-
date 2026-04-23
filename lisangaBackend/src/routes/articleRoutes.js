import { Router } from 'express';
import {
    getAllArticles,
    getArticlesWithAuthor,
    getArticleById,
    getArticlesByUserId,
    getArticlesByCategory,
    createArticle,
    deleteArticle,
} from '../controllers/articleController.js';
import { authenticate } from '../middlewares/auth.js';
import {
    uploadArticleImage,
    handleArticleUploadError,
} from '../middlewares/articleUpload.js';

const router = Router();

// Routes publiques
router.get('/', getAllArticles);
router.get('/with-author', getArticlesWithAuthor);
router.get('/category/:id', getArticlesByCategory);
router.get('/user/:userId', getArticlesByUserId);
router.get('/:id', getArticleById);

// Routes protegees
router.post(
    '/',
    authenticate,
    uploadArticleImage,
    handleArticleUploadError,
    createArticle
);
router.delete('/:id', authenticate, deleteArticle);

export default router;
