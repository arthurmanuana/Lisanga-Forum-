/**
 * @file adminController.js
 * @description Gestion du dashboard administrateur (stats enrichies + CRUD catégories)
 * @conforme PDF: ENDPOINT 6 + gestion catégories | Format { data, message } / { error, code, message }
 * @stack Express 5, ESM, PostgreSQL pool
 */

import { pool } from '../db/pool.js';

// ============================================================================
// HELPERS STANDARDISÉS (Conformes au PDF)
// ============================================================================

/**
 * Format d'erreur imposé par le guide
 */
const respondError = (res, status, code, message) => 
  res.status(status).json({ error: true, code, message });

/**
 * Format de succès imposé par le guide: { data: {...}, message: "..." }
 */
const respondSuccess = (res, status, data = {}, message = 'Opération réussie') => 
  res.status(status).json({ data, message });

// ============================================================================
// GET /api/admin/stats - Statistiques enrichies
// ============================================================================

export const getStats = async (req, res) => {
  try {
    // Exécution parallèle des requêtes pour optimiser le temps de réponse
    const [
      usersRes,
      articlesRes,
      reactionsRes,
      commentsRes,
      recentArticlesRes,
      topAuthorsRes
    ] = await Promise.all([
      // Compteurs de base
      pool.query('SELECT COUNT(*)::integer as total FROM utilisateurs WHERE role = $1', ['utilisateur']),
      pool.query('SELECT COUNT(*)::integer as total FROM articles'),
      pool.query("SELECT COUNT(*)::integer as total FROM reaction WHERE valeur = 'like'"),
      pool.query('SELECT COUNT(*)::integer as total FROM commentaires'),
      
      // Articles récents (5 derniers)
      pool.query(`
        SELECT a.id_article, a.titre, a.date_publication, 
               u.nom_utilisateur as authorUsername
        FROM articles a
        JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateurs
        ORDER BY a.date_publication DESC
        LIMIT 5
      `),
      
      // Top auteurs (par nombre d'articles)
      pool.query(`
        SELECT u.id_utilisateurs, u.nom_utilisateur as username, COUNT(a.id_article)::integer as articleCount
        FROM utilisateurs u
        JOIN articles a ON u.id_utilisateurs = a.id_utilisateur
        GROUP BY u.id_utilisateurs, u.nom_utilisateur
        ORDER BY articleCount DESC
        LIMIT 5
      `)
    ]);

    // Formatage conforme au PDF
    const stats = {
      totalUsers: usersRes.rows[0].total,
      totalArticles: articlesRes.rows[0].total,
      totalComments: commentsRes.rows[0].total,
      totalLikes: reactionsRes.rows[0].total,
      recentArticles: recentArticlesRes.rows.map(row => ({
        id: row.id_article,
        title: row.titre,
        publishedAt: row.date_publication,
        authorUsername: row.authorUsername
      })),
      topAuthors: topAuthorsRes.rows.map(row => ({
        id: row.id_utilisateurs,
        username: row.username,
        articleCount: row.articleCount
      }))
    };

    respondSuccess(res, 200, { stats }, 'Statistiques récupérées avec succès');
  } catch (err) {
    console.error('[Admin] Erreur getStats:', err.message);
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la récupération des statistiques');
  }
};

// ============================================================================
// GET /api/admin/categories - Lister les catégories
// ============================================================================

export const getCategories = async (req, res) => {
  try {
    const query = 'SELECT id_categorie, nom, description, created_at, updated_at FROM categories ORDER BY nom ASC';
    const result = await pool.query(query);
    
    respondSuccess(res, 200, { categories: result.rows }, 'Catégories récupérées');
  } catch (err) {
    console.error('[Admin] Erreur getCategories:', err.message);
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la récupération des catégories');
  }
};

// ============================================================================
// POST /api/admin/categories - Créer une catégorie
// ============================================================================

export const createCategory = async (req, res) => {
  try {
    const { nom, description } = req.body;

    // Validation basique (Zod devrait être appliqué en amont)
    if (!nom || nom.trim().length < 2) {
      return respondError(res, 400, 'VALIDATION_ERROR', 'Le nom de la catégorie doit contenir au moins 2 caractères');
    }

    const query = `
      INSERT INTO categories (nom, description)
      VALUES ($1, $2)
      RETURNING id_categorie, nom, description, created_at, updated_at
    `;
    
    const result = await pool.query(query, [nom.trim(), description || null]);
    
    respondSuccess(res, 201, { category: result.rows[0] }, 'Catégorie créée avec succès');
  } catch (err) {
    if (err.code === '23505') { // unique_violation sur nom UNIQUE
      return respondError(res, 409, 'CATEGORY_ALREADY_EXISTS', 'Cette catégorie existe déjà');
    }
    console.error('[Admin] Erreur createCategory:', err.message);
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la création de la catégorie');
  }
};

// ============================================================================
// PUT /api/admin/categories/:id - Modifier une catégorie
// ============================================================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;

    // Whitelist des champs modifiables
    const allowedUpdates = {};
    if (nom !== undefined) allowedUpdates.nom = nom.trim();
    if (description !== undefined) allowedUpdates.description = description;

    if (Object.keys(allowedUpdates).length === 0) {
      return respondError(res, 400, 'VALIDATION_ERROR', 'Aucun champ valide à mettre à jour');
    }

    // Construction dynamique sécurisée de la requête
    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [field, value] of Object.entries(allowedUpdates)) {
      setClauses.push(`${field} = $${idx}`);
      values.push(value);
      idx++;
    }
    values.push(id); // Pour le WHERE

    const query = `
      UPDATE categories 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id_categorie = $${idx}
      RETURNING id_categorie, nom, description, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
        return respondError(res, 404, 'CATEGORY_NOT_FOUND', 'Catégorie non trouvée');
      }
      respondSuccess(res, 200, { category: result.rows[0] }, 'Catégorie mise à jour');
      
    } catch (err) {
      // Gestion des erreurs PostgreSQL dans le catch
      if (err.code === '23505') { // unique_violation
        return respondError(res, 409, 'CATEGORY_ALREADY_EXISTS', 'Ce nom de catégorie est déjà utilisé');
      }
      console.error('[Admin] Erreur updateCategory:', err.message);
      respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la mise à jour');
    }
  };

// ============================================================================
// DELETE /api/admin/categories/:id - Supprimer une catégorie
// ============================================================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si des articles utilisent cette catégorie (optionnel mais recommandé)
    const articlesUsing = await pool.query(
      'SELECT COUNT(*)::integer as total FROM articles WHERE category = (SELECT nom FROM categories WHERE id_categorie = $1)',
      [id]
    );
    
    if (articlesUsing.rows[0].total > 0) {
      return respondError(res, 400, 'CATEGORY_IN_USE', 'Impossible de supprimer : des articles utilisent cette catégorie');
    }

    const query = 'DELETE FROM categories WHERE id_categorie = $1 RETURNING id_categorie';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return respondError(res, 404, 'CATEGORY_NOT_FOUND', 'Catégorie non trouvée');
    }

    respondSuccess(res, 200, {}, 'Catégorie supprimée avec succès');
  } catch (err) {
    console.error('[Admin] Erreur deleteCategory:', err.message);
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la suppression de la catégorie');
  }
};