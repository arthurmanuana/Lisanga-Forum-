import { pool } from '../db/pool.js';

export const CommentaireModel = {
    async getCommentsByArticleId(id_article) {
        try {
            const { rows } = await pool.query(
                `SELECT c.*, 
                        u.nom, 
                        u.prenom, 
                        u.nom_utilisateur, 
                        u.photo AS photo_utilisateur
                 FROM commentaires c
                 JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateurs
                 WHERE c.id_article = $1 
                   AND c.id_parent_commentaire IS NULL
                 ORDER BY c.date_commentaire ASC`,
                [id_article]
            );
            return rows;
        } catch (error) {
            console.error(`Erreur lors de la récupération des commentaires de l'article :`, error);
            throw error;
        }
    },

    async getRepliesByCommentId(id_parent_commentaire) {
        try {
            const { rows } = await pool.query(
                `SELECT c.*, 
                        u.nom, 
                        u.prenom, 
                        u.nom_utilisateur, 
                        u.photo AS photo_utilisateur
                 FROM commentaires c
                 JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateurs
                 WHERE c.id_parent_commentaire = $1
                 ORDER BY c.date_commentaire ASC`,
                [id_parent_commentaire]
            );
            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des réponses :', error);
            throw error;
        }
    },

    async getCommentById(id_commentaire) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM commentaires WHERE id_commentaire = $1',
                [id_commentaire]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur lors de la récupération du commentaire :', error);
            throw error;
        }
    },

    async createComment({ id_article, id_utilisateur, contenu, id_parent_commentaire = null }) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO commentaires (id_article, id_utilisateur, contenu, id_parent_commentaire)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [id_article, id_utilisateur, contenu, id_parent_commentaire]
            );
            return rows[0];
        } catch (error) {
            console.error('Erreur lors de la création du commentaire :', error);
            throw error;
        }
    },

    async updateComment({ id_commentaire, contenu }) {
        try {
            const { rows } = await pool.query(
                `UPDATE commentaires 
                 SET contenu = $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE id_commentaire = $2 
                 RETURNING *`,
                [contenu, id_commentaire]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du commentaire :', error);
            throw error;
        }
    },

    async deleteComment({ id_commentaire }) {
        try {
            const { rows } = await pool.query(
                'DELETE FROM commentaires WHERE id_commentaire = $1 RETURNING *',
                [id_commentaire]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur lors de la suppression du commentaire :', error);
            throw error;
        }
    },

    async getCommentsByUserId(id_utilisateur) {
        try {
            const { rows } = await pool.query(
                `SELECT c.*, a.titre AS titre_article
                 FROM commentaires c
                 JOIN articles a ON c.id_article = a.id_article
                 WHERE c.id_utilisateur = $1
                 ORDER BY c.date_commentaire DESC`,
                [id_utilisateur]
            );
            return rows;
        } catch (error) {
            console.error(`Erreur lors de la récupération des commentaires de l'utilisateur :`, error);
            throw error;
        }
    },
};
