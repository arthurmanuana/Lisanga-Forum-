import {pool} from '../db/pool.js';

export const ArticleModel = {
    async getAllArticles({ page = 1, limit = 10 } = {}) {
        try {
            const offset = (page - 1) * limit;
            const { rows } = await pool.query(
                `SELECT * FROM articles 
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
            const {rows}= await pool.query('SELECT * FROM articles WHERE id_article = $1', [id]);
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
                'SELECT * FROM articles WHERE id_utilisateur = $1 ORDER BY date_publication DESC',
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
                        c.nom AS nom_categorie
                 FROM articles a
                 JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateurs
                 JOIN categories c ON a.id_categorie = c.id_categorie
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
                        c.nom AS nom_categorie
                 FROM articles a
                 JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateurs
                 JOIN categories c ON a.id_categorie = c.id_categorie
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