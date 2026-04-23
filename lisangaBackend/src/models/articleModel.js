import {pool} from '../db/pool.js';

export const ArticleModel = {
    async getAllArticles({ page = 1, limit = 10 } = {}) {
        try {
            const offset = (page - 1) * limit;
            const { rows } = await pool.query(
                `SELECT a.*,
                        COALESCE(rc.likes_count, 0) AS likes_count,
                        COALESCE(rc.dislikes_count, 0) AS dislikes_count,
                        COALESCE(cc.comments_count, 0) AS comments_count
                 FROM articles a
                 LEFT JOIN (
                    SELECT
                        id_article,
                        COUNT(*) FILTER (WHERE valeur = 'like')::int AS likes_count,
                        COUNT(*) FILTER (WHERE valeur = 'dislike')::int AS dislikes_count
                    FROM reaction
                    GROUP BY id_article
                 ) rc ON rc.id_article = a.id_article
                 LEFT JOIN (
                    SELECT id_article, COUNT(*)::int AS comments_count
                    FROM commentaires
                    WHERE is_deleted = FALSE
                    GROUP BY id_article
                 ) cc ON cc.id_article = a.id_article
                 ORDER BY date_publication DESC 
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            );

            const { rows: countRows } = await pool.query(
                'SELECT COUNT(*)::int AS total FROM articles'
            );

            return {
                data: rows,
                pagination: {
                    page,
                    limit,
                    total: countRows[0].total,
                    totalPages: Math.ceil(countRows[0].total / limit),
                },
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des articles : ', error);
            throw error;
        }
    },

    async getArticleById(id){
        try {
            const {rows}= await pool.query(
                `SELECT a.*,
                        u.nom,
                        u.prenom,
                        u.nom_utilisateur,
                        u.photo AS photo_utilisateur,
                        c.nom AS nom_categorie,
                        COALESCE(rc.likes_count, 0) AS likes_count,
                        COALESCE(rc.dislikes_count, 0) AS dislikes_count,
                        COALESCE(cc.comments_count, 0) AS comments_count
                 FROM articles a
                 JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateurs
                 JOIN categories c ON a.id_categorie = c.id_categorie
                 LEFT JOIN (
                    SELECT
                        id_article,
                        COUNT(*) FILTER (WHERE valeur = 'like')::int AS likes_count,
                        COUNT(*) FILTER (WHERE valeur = 'dislike')::int AS dislikes_count
                    FROM reaction
                    GROUP BY id_article
                 ) rc ON rc.id_article = a.id_article
                 LEFT JOIN (
                    SELECT id_article, COUNT(*)::int AS comments_count
                    FROM commentaires
                    WHERE is_deleted = FALSE
                    GROUP BY id_article
                 ) cc ON cc.id_article = a.id_article
                 WHERE a.id_article = $1`,
                [id]
            );
            return rows[0] || null;
        } catch (error){
            console.error('Erreur lors de la récupération de l\'article: ', error);
            throw error;
        }
    },
    async createArticle({id_utilisateur, id_categorie, titre, contenu, photo}){
        try {
            const {rows} = await pool.query(
                `INSERT INTO articles (id_utilisateur, id_categorie, titre, contenu, photo) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [id_utilisateur, id_categorie, titre, contenu, photo]
            );
            return rows[0];
        } catch (error){
            console.error(`Erreur lors de la création de l'article :`, error);
            throw error;
        }
    },

    async updateArticle({ id_article, id_categorie, titre, contenu, photo }){
        try {
            const { rows } = await pool.query(
                `UPDATE articles
                 SET id_categorie = $1,
                     titre = $2,
                     contenu = $3,
                     photo = COALESCE($4, photo),
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id_article = $5
                 RETURNING *`,
                [id_categorie, titre, contenu, photo, id_article]
            );
            return rows[0] || null;
        } catch (error){
            console.error('Erreur lors de la mise à jour de l\'article : ', error);
            throw error;
        }
    },

    async deleteArticle({id_article}){
        try {
            const {rows} = await pool.query('DELETE FROM articles WHERE id_article = $1 RETURNING *', [id_article]);
            return rows [0] || null;
        } catch (error){
            console.error('Erreur lors de la suppression de l\'article : ', error);
            throw error;
        }
    },
    async getArticlesByUserId(id_utilisateur){
        try {
            const {rows} = await pool.query(
                `SELECT a.*,
                        COALESCE(rc.likes_count, 0) AS likes_count,
                        COALESCE(rc.dislikes_count, 0) AS dislikes_count,
                        COALESCE(cc.comments_count, 0) AS comments_count
                 FROM articles a
                 LEFT JOIN (
                    SELECT
                        id_article,
                        COUNT(*) FILTER (WHERE valeur = 'like')::int AS likes_count,
                        COUNT(*) FILTER (WHERE valeur = 'dislike')::int AS dislikes_count
                    FROM reaction
                    GROUP BY id_article
                 ) rc ON rc.id_article = a.id_article
                 LEFT JOIN (
                    SELECT id_article, COUNT(*)::int AS comments_count
                    FROM commentaires
                    WHERE is_deleted = FALSE
                    GROUP BY id_article
                 ) cc ON cc.id_article = a.id_article
                 WHERE a.id_utilisateur = $1
                 ORDER BY a.date_publication DESC`,
                [id_utilisateur]
            );
            return rows;
        } catch (error){
            console.error(`Erreur lors de la récupération des articles de l'utilisateur :`, error);
            throw error;
        }
    },
    async getArticlesWithAuthor({ page = 1, limit = 10 } = {}) {
        try {
            const offset = (page - 1) * limit;
            const { rows } = await pool.query(
                `SELECT a.*, 
                        u.nom, 
                        u.prenom, 
                        u.nom_utilisateur, 
                        u.photo AS photo_utilisateur,
                        c.nom AS nom_categorie,
                        COALESCE(rc.likes_count, 0) AS likes_count,
                        COALESCE(rc.dislikes_count, 0) AS dislikes_count,
                        COALESCE(cc.comments_count, 0) AS comments_count
                 FROM articles a
                 JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateurs
                 JOIN categories c ON a.id_categorie = c.id_categorie
                 LEFT JOIN (
                    SELECT
                        id_article,
                        COUNT(*) FILTER (WHERE valeur = 'like')::int AS likes_count,
                        COUNT(*) FILTER (WHERE valeur = 'dislike')::int AS dislikes_count
                    FROM reaction
                    GROUP BY id_article
                 ) rc ON rc.id_article = a.id_article
                 LEFT JOIN (
                    SELECT id_article, COUNT(*)::int AS comments_count
                    FROM commentaires
                    WHERE is_deleted = FALSE
                    GROUP BY id_article
                 ) cc ON cc.id_article = a.id_article
                 ORDER BY a.date_publication DESC
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            );

            const { rows: countRows } = await pool.query(
                'SELECT COUNT(*)::int AS total FROM articles'
            );

            return {
                data: rows,
                pagination: {
                    page,
                    limit,
                    total: countRows[0].total,
                    totalPages: Math.ceil(countRows[0].total / limit),
                },
            };
        } catch (error) {
            console.error(`Erreur lors de la récupération des articles avec l'auteur :`, error);
            throw error;
        }
    },

    async getArticlesByCategory(id_categorie){
        try {
            const {rows} = await pool.query(
                `SELECT a.*, 
                        u.nom, 
                        u.prenom, 
                        u.nom_utilisateur, 
                        u.photo AS photo_utilisateur,
                        c.nom AS nom_categorie,
                        COALESCE(rc.likes_count, 0) AS likes_count,
                        COALESCE(rc.dislikes_count, 0) AS dislikes_count,
                        COALESCE(cc.comments_count, 0) AS comments_count
                 FROM articles a
                 JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateurs
                 JOIN categories c ON a.id_categorie = c.id_categorie
                 LEFT JOIN (
                    SELECT
                        id_article,
                        COUNT(*) FILTER (WHERE valeur = 'like')::int AS likes_count,
                        COUNT(*) FILTER (WHERE valeur = 'dislike')::int AS dislikes_count
                    FROM reaction
                    GROUP BY id_article
                 ) rc ON rc.id_article = a.id_article
                 LEFT JOIN (
                    SELECT id_article, COUNT(*)::int AS comments_count
                    FROM commentaires
                    WHERE is_deleted = FALSE
                    GROUP BY id_article
                 ) cc ON cc.id_article = a.id_article
                 WHERE a.id_categorie = $1
                 ORDER BY a.date_publication DESC`,
                [id_categorie]
            );
            return rows;
        } catch (error){
            console.error(`Erreur lors de la récupération des articles par catégorie :`, error);
            throw error;
        }
    },
};