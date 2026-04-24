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

// ============================================================================
// GET /api/admin/users - Liste paginée des utilisateurs (vue admin)
// ============================================================================

export const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const [usersRes, countRes] = await Promise.all([
      pool.query(
        `SELECT
          id_utilisateurs,
          nom_utilisateur,
          email,
          role,
          TRUE AS is_active,
          created_at
         FROM utilisateurs
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query('SELECT COUNT(*)::integer as total FROM utilisateurs')
    ]);

    const users = usersRes.rows.map((u) => ({
      id: u.id_utilisateurs,
      username: u.nom_utilisateur || 'utilisateur',
      email: u.email,
      role: u.role,
      isActive: u.is_active,
      createdAt: u.created_at,
    }));

    const total = countRes.rows[0].total;
    return respondSuccess(
      res,
      200,
      {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.max(1, Math.ceil(total / limit)),
          totalUsers: total,
        },
      },
      'Utilisateurs récupérés avec succès'
    );
  } catch (err) {
    console.error('[Admin] Erreur getUsers:', err.message);
    return respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la récupération des utilisateurs');
  }
};