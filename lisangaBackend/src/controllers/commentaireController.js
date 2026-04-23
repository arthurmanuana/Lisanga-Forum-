import { CommentaireModel } from '../models/commentaireModel.js';

const toPositiveInt = (value) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    return parsed;
};

export const getCommentsByArticleId = async (req, res) => {
    try {
        const id_article = toPositiveInt(req.params.articleId ?? req.params.id);
        if (!id_article) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de l'article est invalide",
            });
        }

        const comments = await CommentaireModel.getCommentsByArticleId(id_article);
        return res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error) {
        console.error("Erreur getCommentsByArticleId :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la recuperation des commentaires de l'article",
        });
    }
};

export const getRepliesByCommentId = async (req, res) => {
    try {
        const id_parent_commentaire = toPositiveInt(
            req.params.commentId ?? req.params.id_parent_commentaire ?? req.params.id
        );

        if (!id_parent_commentaire) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant du commentaire parent est invalide",
            });
        }

        const replies = await CommentaireModel.getRepliesByCommentId(id_parent_commentaire);
        return res.status(200).json({
            success: true,
            data: replies,
        });
    } catch (error) {
        console.error('Erreur getRepliesByCommentId :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recuperation des reponses',
        });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const id_commentaire = toPositiveInt(req.params.id);
        if (!id_commentaire) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant du commentaire est invalide",
            });
        }

        const comment = await CommentaireModel.getCommentById(id_commentaire);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Commentaire introuvable',
            });
        }

        return res.status(200).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        console.error('Erreur getCommentById :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recuperation du commentaire',
        });
    }
};

export const createComment = async (req, res) => {
    try {
        const id_utilisateur = req.user?.id;
        if (!id_utilisateur) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise',
            });
        }

        const { id_article, contenu, id_parent_commentaire } = req.body;

        const parsedArticleId = toPositiveInt(id_article);
        if (!parsedArticleId) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de l'article est obligatoire et invalide",
            });
        }

        if (!contenu || typeof contenu !== 'string' || contenu.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Le contenu du commentaire est obligatoire',
            });
        }

        if (contenu.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Le commentaire ne doit pas depasser 1000 caracteres',
            });
        }

        const parsedParentId =
            id_parent_commentaire === null || id_parent_commentaire === undefined
                ? null
                : toPositiveInt(id_parent_commentaire);

        if (id_parent_commentaire !== null && id_parent_commentaire !== undefined && !parsedParentId) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant du commentaire parent est invalide",
            });
        }

        const newComment = await CommentaireModel.createComment({
            id_article: parsedArticleId,
            id_utilisateur,
            contenu: contenu.trim(),
            id_parent_commentaire: parsedParentId,
        });

        return res.status(201).json({
            success: true,
            message: 'Commentaire cree avec succes',
            data: newComment,
        });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                success: false,
                message: 'Article, utilisateur ou commentaire parent invalide',
            });
        }

        if (
            error.message === 'Le commentaire parent est introuvable' ||
            error.message.includes('Impossible de repondre')
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        console.error('Erreur createComment :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la creation du commentaire',
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const id_commentaire = toPositiveInt(req.params.id);
        if (!id_commentaire) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant du commentaire est invalide",
            });
        }

        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise',
            });
        }

        const comment = await CommentaireModel.getCommentById(id_commentaire);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Commentaire introuvable',
            });
        }

        const isOwner = comment.id_utilisateur === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Vous n'avez pas le droit de supprimer ce commentaire",
            });
        }

        const deleted = await CommentaireModel.softDeleteComment({ id_commentaire });
        return res.status(200).json({
            success: true,
            message: 'Commentaire supprime avec succes',
            data: deleted,
        });
    } catch (error) {
        console.error('Erreur deleteComment :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du commentaire',
        });
    }
};

export const getCommentsByUserId = async (req, res) => {
    try {
        const id_utilisateur = toPositiveInt(req.params.userId ?? req.params.id);
        if (!id_utilisateur) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant utilisateur est invalide",
            });
        }

        const comments = await CommentaireModel.getCommentsByUserId(id_utilisateur);
        return res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error) {
        console.error('Erreur getCommentsByUserId :', error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la recuperation des commentaires de l'utilisateur",
        });
    }
};
