import { pool } from '../db/pool.js';

export const CategorieModel = {
    async getAllCategories() {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM categories ORDER BY nom ASC'
            );
            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
            throw error;
        }
    },

    async getCategorieById(id_categorie) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM categories WHERE id_categorie = $1',
                [id_categorie]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur lors de la récupération de la catégorie :', error);
            throw error;
        }
    },

    async createCategorie({ nom, description }) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO categories (nom, description)
                 VALUES ($1, $2)
                 RETURNING *`,
                [nom, description]
            );
            return rows[0];
        } catch (error) {
            console.error('Erreur lors de la création de la catégorie :', error);
            throw error;
        }
    },

    async updateCategorie({ id_categorie, nom, description }) {
        try {
            const { rows } = await pool.query(
                `UPDATE categories
                 SET nom = $1, description = $2, updated_at = CURRENT_TIMESTAMP
                 WHERE id_categorie = $3
                 RETURNING *`,
                [nom, description, id_categorie]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie :', error);
            throw error;
        }
    },

    async deleteCategorie({ id_categorie }) {
        try {
            const { rows } = await pool.query(
                'DELETE FROM categories WHERE id_categorie = $1 RETURNING *',
                [id_categorie]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie :', error);
            throw error;
        }
    },
};
