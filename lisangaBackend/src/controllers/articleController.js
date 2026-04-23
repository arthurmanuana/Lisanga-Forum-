import { ArticleModel } from '../models/articleModel.js';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

const toPositiveInt = (value, fallback = null) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
    return parsed;
};

const parsePagination = (query) => {
    const page = toPositiveInt(query.page, 1);
    const limit = Math.min(toPositiveInt(query.limit, 10), 50);
    return { page, limit };
};

const validateUploadedImage = (file) => {
    if (!file) return null;

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
        return 'Format image invalide. Formats autorises : JPG, PNG, WebP.';
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return 'Image trop lourde. Taille maximale autorisee : 5 Mo.';
    }

    return null;
};

export const getAllArticles = async (req, res) => {
    try {
        const { page, limit } = parsePagination(req.query);
        const articles = await ArticleModel.getAllArticles({ page, limit });

        return res.status(200).json({
            success: true,
            ...articles,
        });
    } catch (error) {
        console.error('Erreur getAllArticles :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recuperation des articles',
        });
    }
};

export const getArticlesWithAuthor = async (req, res) => {
    try {
        const { page, limit } = parsePagination(req.query);
        const articles = await ArticleModel.getArticlesWithAuthor({ page, limit });

        return res.status(200).json({
            success: true,
            ...articles,
        });
    } catch (error) {
        console.error("Erreur getArticlesWithAuthor :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la recuperation des articles avec auteur",
        });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const id = toPositiveInt(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de l'article est invalide",
            });
        }

        const article = await ArticleModel.getArticleById(id);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article introuvable',
            });
        }

        return res.status(200).json({
            success: true,
            data: article,
        });
    } catch (error) {
        console.error('Erreur getArticleById :', error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la recuperation de l'article",
        });
    }
};

export const getArticlesByUserId = async (req, res) => {
    try {
        const userId = toPositiveInt(req.params.userId ?? req.params.id);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant utilisateur est invalide",
            });
        }

        const articles = await ArticleModel.getArticlesByUserId(userId);
        return res.status(200).json({
            success: true,
            data: articles,
        });
    } catch (error) {
        console.error('Erreur getArticlesByUserId :', error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la recuperation des articles de l'utilisateur",
        });
    }
};

export const getArticlesByCategory = async (req, res) => {
    try {
        const categoryId = toPositiveInt(
            req.params.id_categorie ?? req.params.categoryId ?? req.params.id
        );

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de categorie est invalide",
            });
        }

        const articles = await ArticleModel.getArticlesByCategory(categoryId);
        return res.status(200).json({
            success: true,
            data: articles,
        });
    } catch (error) {
        console.error('Erreur getArticlesByCategory :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recuperation des articles par categorie',
        });
    }
};

export const createArticle = async (req, res) => {
    try {
        const id_utilisateur = req.user?.id;
        if (!id_utilisateur) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise',
            });
        }

        const { id_categorie, titre, contenu, photo } = req.body;

        const parsedCategoryId = toPositiveInt(id_categorie);
        if (!parsedCategoryId) {
            return res.status(400).json({
                success: false,
                message: "La categorie est obligatoire et doit etre valide",
            });
        }

        if (!titre || typeof titre !== 'string' || titre.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le titre de l'article est obligatoire",
            });
        }

        if (titre.trim().length > 255) {
            return res.status(400).json({
                success: false,
                message: "Le titre de l'article ne doit pas depasser 255 caracteres",
            });
        }

        if (!contenu || typeof contenu !== 'string' || contenu.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le contenu de l'article est obligatoire",
            });
        }

        const imageValidationError = validateUploadedImage(req.file);
        if (imageValidationError) {
            return res.status(400).json({
                success: false,
                message: imageValidationError,
            });
        }

        const finalPhoto = req.file?.filename
            ? `/uploads/articles/${req.file.filename}`
            : (typeof photo === 'string' && photo.trim().length > 0 ? photo.trim() : null);

        const newArticle = await ArticleModel.createArticle({
            id_utilisateur,
            id_categorie: parsedCategoryId,
            titre: titre.trim(),
            contenu: contenu.trim(),
            photo: finalPhoto,
        });

        return res.status(201).json({
            success: true,
            message: 'Article cree avec succes',
            data: newArticle,
        });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                success: false,
                message: 'Categorie ou utilisateur invalide',
            });
        }

        console.error('Erreur createArticle :', error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la creation de l'article",
        });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const id_article = toPositiveInt(req.params.id);
        if (!id_article) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de l'article est invalide",
            });
        }

        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise',
            });
        }

        const article = await ArticleModel.getArticleById(id_article);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article introuvable',
            });
        }

        const isOwner = article.id_utilisateur === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Vous n'avez pas le droit de modifier cet article",
            });
        }

        const { id_categorie, titre, contenu, photo } = req.body;

        const parsedCategoryId = toPositiveInt(id_categorie);
        if (!parsedCategoryId) {
            return res.status(400).json({
                success: false,
                message: "La categorie est obligatoire et doit etre valide",
            });
        }

        if (!titre || typeof titre !== 'string' || titre.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le titre de l'article est obligatoire",
            });
        }

        if (titre.trim().length > 255) {
            return res.status(400).json({
                success: false,
                message: "Le titre de l'article ne doit pas depasser 255 caracteres",
            });
        }

        if (!contenu || typeof contenu !== 'string' || contenu.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le contenu de l'article est obligatoire",
            });
        }

        const imageValidationError = validateUploadedImage(req.file);
        if (imageValidationError) {
            return res.status(400).json({
                success: false,
                message: imageValidationError,
            });
        }

        const finalPhoto = req.file?.filename
            ? `/uploads/articles/${req.file.filename}`
            : (typeof photo === 'string' && photo.trim().length > 0 ? photo.trim() : null);

        const updatedArticle = await ArticleModel.updateArticle({
            id_article,
            id_categorie: parsedCategoryId,
            titre: titre.trim(),
            contenu: contenu.trim(),
            photo: finalPhoto,
        });

        return res.status(200).json({
            success: true,
            message: 'Article modifie avec succes',
            data: updatedArticle,
        });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                success: false,
                message: 'Categorie invalide',
            });
        }

        console.error('Erreur updateArticle :', error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la mise a jour de l'article",
        });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const id_article = toPositiveInt(req.params.id);
        if (!id_article) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de l'article est invalide",
            });
        }

        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise',
            });
        }

        const article = await ArticleModel.getArticleById(id_article);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article introuvable',
            });
        }

        const isOwner = article.id_utilisateur === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Vous n'avez pas le droit de supprimer cet article",
            });
        }

        const deletedArticle = await ArticleModel.deleteArticle({ id_article });
        return res.status(200).json({
            success: true,
            message: 'Article supprime avec succes',
            data: deletedArticle,
        });
    } catch (error) {
        console.error('Erreur deleteArticle :', error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'article",
        });
    }
};
