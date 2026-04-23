/**
 * @file reactionModel.js
 * @description Couche d'accès aux données pour la table 'reaction'
 * @author Lisanga Team
 * @version 1.0.0
 * @note Ce modèle est conçu pour être appelé par les Controllers.
 *       Il ne connaît pas HTTP, ne manipule pas `req`/`res`, et retourne
 *       toujours un format standardisé : { success, data?, error? }
 */

import { pool } from '../db/pool.js';

// ============================================================================
// CONSTANTES & CONFIGURATION
// ============================================================================

/**
 * Codes d'erreur PostgreSQL courants à intercepter
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
const PG_FK_VIOLATION = '23503'; // foreign_key_violation (article ou user n'existe pas)
const PG_CHECK_VIOLATION = '23514'; // check_violation (valeur hors 'like'/'dislike')

/**
 * Valeurs autorisées pour la réaction (doit matcher le CHECK constraint SQL)
 */
const ALLOWED_REACTION_VALUES = ['like', 'dislike'];

// ============================================================================
// MÉTHODE PRINCIPALE : UPSERT (Ajout ou Modification)
// ============================================================================

/**
 * Ajouter ou mettre à jour une réaction (toggle like/dislike)
 * Utilise `ON CONFLICT DO UPDATE` pour gérer le "changement d'avis" en une seule requête.
 * 
 * @param {number} articleId - ID de l'article concerné
 * @param {number} userId - ID de l'utilisateur qui réagit
 * @param {'like'|'dislike'} valeur - Type de réaction
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} Résultat
 * 
 * @example
 * const result = await upsert(12, 42, 'dislike');
 * // Si l'utilisateur avait déjà liké, la BDD mettra à jour vers 'dislike'
 */
export const upsert = async (articleId, userId, valeur) => {
  try {
    // Validation pré-DB : évite une requête inutile vers PostgreSQL
    if (!ALLOWED_REACTION_VALUES.includes(valeur)) {
      return { success: false, error: 'Valeur invalide. Utilisez "like" ou "dislike"' };
    }

    // ON CONFLICT gère élégamment :
    // - Cas 1 : Première réaction → INSERT
    // - Cas 2 : Réaction existante → UPDATE (change like ↔ dislike)
    const query = `
      INSERT INTO reaction (valeur, id_article, id_utilisateur)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_article, id_utilisateur)
      DO UPDATE SET 
        valeur = EXCLUDED.valeur,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id_reaction, valeur, date_like, created_at
    `;

    const result = await pool.query(query, [valeur, articleId, userId]);
    const reaction = result.rows[0];

    return {
      success: true,
      data: {
        ...reaction,
        // Indique au frontend si c'est une nouvelle réaction ou un changement
        isUpdated: reaction.date_like.getTime() !== reaction.created_at.getTime()
      }
    };

  } catch (err) {
    // Si l'article ou l'utilisateur n'existe pas, PostgreSQL lève une FK violation
    if (err.code === PG_FK_VIOLATION) {
      return { success: false, error: 'Impossible de réagir : article ou utilisateur introuvable' };
    }

    console.error('[DB] Erreur upsert reaction:', err.message);
    return { success: false, error: 'Erreur serveur lors du traitement de la réaction' };
  }
};

// ============================================================================
// MÉTHODE DE SUPPRESSION (Retirer une réaction)
// ============================================================================

/**
 * Supprimer la réaction d'un utilisateur sur un article
 * @param {number} articleId - ID de l'article
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const remove = async (articleId, userId) => {
  try {
    const query = 'DELETE FROM reaction WHERE id_article = $1 AND id_utilisateur = $2 RETURNING id_reaction';
    const result = await pool.query(query, [articleId, userId]);

    if (result.rows.length === 0) {
      return { success: false, error: 'Aucune réaction trouvée pour cet utilisateur sur cet article' };
    }

    return { success: true };
  } catch (err) {
    console.error('[DB] Erreur remove reaction:', err.message);
    return { success: false, error: 'Erreur lors de la suppression de la réaction' };
  }
};

// ============================================================================
// MÉTHODES DE LECTURE (READ)
// ============================================================================

/**
 * Vérifier quelle réaction un utilisateur a donnée sur un article
 * @param {number} articleId - ID de l'article
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<{success: boolean, data?: 'like'|'dislike'|null, error?: string}>}
 */
export const getUserReaction = async (articleId, userId) => {
  try {
    const query = 'SELECT valeur FROM reaction WHERE id_article = $1 AND id_utilisateur = $2';
    const result = await pool.query(query, [articleId, userId]);
    
    return {
      success: true,
      data: result.rows[0]?.valeur || null // null = pas de réaction
    };
  } catch (err) {
    console.error('[DB] Erreur getUserReaction:', err.message);
    return { success: false, error: 'Erreur de consultation de la réaction' };
  }
};

/**
 * Compter les likes et dislikes pour un article
 * Utilise `COUNT() FILTER()` pour une agrégation performante en PostgreSQL
 * @param {number} articleId - ID de l'article
 * @returns {Promise<{success: boolean, data?: {likes: number, dislikes: number}, error?: string}>}
 */
export const getCounts = async (articleId) => {
  try {
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE valeur = 'like') AS likes,
        COUNT(*) FILTER (WHERE valeur = 'dislike') AS dislikes
      FROM reaction
      WHERE id_article = $1
    `;
    
    const result = await pool.query(query, [articleId]);
    const { likes, dislikes } = result.rows[0];

    return { success: true, data: { likes: Number(likes), dislikes: Number(dislikes) } };
  } catch (err) {
    console.error('[DB] Erreur getCounts:', err.message);
    return { success: false, error: 'Erreur de calcul des scores' };
  }
};

/**
 * Récupérer les réactions récentes d'un article avec les infos publiques des utilisateurs
 * (Utile pour afficher "Aminata et 12 autres ont aimé")
 * @param {number} articleId - ID de l'article
 * @param {Object} options - Options de pagination
 * @param {number} [options.limit=20] - Nombre max de réactions
 * @param {number} [options.offset=0] - Décalage pour pagination
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const getRecentWithUsers = async (articleId, { limit = 20, offset = 0 } = {}) => {
  try {
    const query = `
      SELECT 
        r.valeur,
        r.date_like,
        u.id_utilisateurs,
        u.nom,
        u.prenom,
        u.nom_utilisateur,
        u.photo
      FROM reaction r
      JOIN utilisateurs u ON r.id_utilisateur = u.id_utilisateurs
      WHERE r.id_article = $1
      ORDER BY r.date_like DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [articleId, limit, offset]);
    return { success: true, data: result.rows };
  } catch (err) {
    console.error('[DB] Erreur getRecentWithUsers:', err.message);
    return { success: false, error: 'Erreur de récupération des réactions' };
  }
};

// ============================================================================
// MÉTHODES UTILITAIRES (OPTIONNELLES MAIS UTILES)
// ============================================================================

/**
 * Obtenir les articles les plus réactifs (utile pour le feed "Tendances")
 * @param {number} limit - Nombre d'articles à retourner
 * @returns {Promise<{success: boolean, data?: Array<{id_article: number, score: number}>, error?: string}>}
 */
export const getTopReactedArticles = async (limit = 10) => {
  try {
    // Score simple : likes - dislikes
    const query = `
      SELECT 
        id_article,
        (COUNT(*) FILTER (WHERE valeur = 'like') - COUNT(*) FILTER (WHERE valeur = 'dislike')) AS score
      FROM reaction
      GROUP BY id_article
      ORDER BY score DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return { success: true, data: result.rows };
  } catch (err) {
    console.error('[DB] Erreur getTopReactedArticles:', err.message);
    return { success: false, error: 'Erreur de calcul des tendances' };
  }
};