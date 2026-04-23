/**
 * @file adminController.js
 * @description Gestion du dashboard administrateur (stats, modération)
 * @conforme PDF: ENDPOINT 6 - GET /api/admin/stats (admin only)
 * @stack Express 5, ESM, PostgreSQL pool
 */

import { pool } from '../db/pool.js';

// ============================================================================
// HELPERS STANDARDISÉS (Identiques aux autres controllers)
// ============================================================================

const respondError = (res, status, code, message) => 
  res.status(status).json({ error: true, code, message });

const respondSuccess = (res, status, data = {}, message = 'Opération réussie') => 
  res.status(status).json({ error: false, code: 'SUCCESS', message, ...data });

// ============================================================================
// GET /api/admin/stats - Statistiques globales de la plateforme
// ============================================================================

export const getStats = async (req, res) => {
  try {
    // Optimisation : exécuter les 4 compteurs EN PARALLÈLE
    // Réduit le temps de réponse de ~4x par rapport à des requêtes séquentielles
    const [usersRes, articlesRes, reactionsRes, commentsRes] = await Promise.all([
      pool.query('SELECT COUNT(*)::integer as total FROM utilisateurs'),
      pool.query('SELECT COUNT(*)::integer as total FROM articles'),
      pool.query('SELECT COUNT(*)::integer as total FROM reaction'),
      pool.query('SELECT COUNT(*)::integer as total FROM commentaires')
    ]);

    // Format exact demandé par le PDF & frontend
    const stats = {
      users: usersRes.rows[0].total,
      articles: articlesRes.rows[0].total,
      reactions: reactionsRes.rows[0].total,
      comments: commentsRes.rows[0].total
    };

    respondSuccess(res, 200, { stats }, 'Statistiques récupérées avec succès');
  } catch (err) {
    // En prod, remplacer par un logger (pino/winston)
    console.error('[Admin] Erreur getStats:', err.message);
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la récupération des statistiques');
  }
};

// Note : Tu pourras ajouter ici plus tard :
// - deleteUser, banUser, moderateArticle, etc.
// - Toujours protégés par le middleware authorizeRoles('admin')