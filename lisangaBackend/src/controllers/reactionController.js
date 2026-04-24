/**
 * @file reactionController.js
 * @description Gestion des réactions (like/dislike) sur les articles
 * @conforme PDF: POST /api/articles/:id/like | Format erreur { error, code, message } | JWT requis
 * @stack Express 5, ESM, reactionModel.js
 */

import * as reactionModel from '../models/reactionModel.js';

// ============================================================================
// HELPERS STANDARDISÉS (Conformes au PDF)
// ============================================================================

/**
 * Format de réponse d'erreur imposé par le guide d'intégration
 */
const respondError = (res, status, code, message) => 
  res.status(status).json({ error: true, code, message });

/**
 * Format de réponse succès standardisé
 */
const respondSuccess = (res, status, data = {}, message = 'Opération réussie') => 
  res.status(status).json({ error: false, code: 'SUCCESS', message, ...data });

// ============================================================================
// POST /api/articles/:id/like - Toggle like/dislike
// ============================================================================

/**
 * Gère le "toggle" : 
 * - Si l'utilisateur n'a pas encore réagi → ajoute la réaction
 * - Si l'utilisateur a déjà réagi → change like ↔ dislike
 * 
 * @route POST /api/articles/:id/like
 * @access Privé (JWT requis)
 */
export const toggleReaction = async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const { valeur } = req.body; // 'like' ou 'dislike' envoyé par le frontend
    const userId = req.user.id; // Injecté par le middleware authenticate()

    // Validation basique de la valeur
    if (!valeur || !['like', 'dislike'].includes(valeur)) {
      return respondError(res, 400, 'INVALID_REACTION_VALUE', 'La valeur doit être "like" ou "dislike"');
    }

    // Délégation au modèle (gère INSERT ou UPDATE via ON CONFLICT)
    const result = await reactionModel.upsert(articleId, userId, valeur);

    if (!result.success) {
      // Le modèle peut échouer si l'article n'existe pas (FK violation)
      return respondError(res, 400, 'REACTION_FAILED', result.error);
    }

    // Réponse conforme au frontend : on retourne la réaction + les compteurs mis à jour
    const counts = await reactionModel.getCounts(articleId);
    
    respondSuccess(res, 200, {
      reaction: result.data,
      counts: counts.data
    }, 'Réaction enregistrée');

  } catch (err) {
    // Erreur inattendue (DB down, etc.)
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors du traitement de la réaction');
  }
};

// ============================================================================
// DELETE /api/articles/:id/like - Retirer sa réaction
// ============================================================================

/**
 * Permet à l'utilisateur de retirer son like/dislike
 * 
 * @route DELETE /api/articles/:id/like
 * @access Privé (JWT requis)
 */
export const removeReaction = async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const userId = req.user.id;

    const result = await reactionModel.remove(articleId, userId);

    if (!result.success) {
      return respondError(res, 404, 'REACTION_NOT_FOUND', 'Aucune réaction trouvée à supprimer');
    }

    // Retourner les compteurs mis à jour pour rafraîchir l'UI
    const counts = await reactionModel.getCounts(articleId);
    
    respondSuccess(res, 200, { counts: counts.data }, 'Réaction supprimée');
  } catch (err) {
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la suppression de la réaction');
  }
};

// ============================================================================
// GET /api/articles/:id/reactions - Compter les likes/dislikes
// ============================================================================

/**
 * Retourne le score d'un article : { likes: X, dislikes: Y }
 * Route publique (pas d'auth requise) pour afficher les compteurs
 * 
 * @route GET /api/articles/:id/reactions
 * @access Public
 */
export const getReactionCounts = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const result = await reactionModel.getCounts(articleId);

    if (!result.success) {
      return respondError(res, 500, 'COUNTS_FETCH_FAILED', result.error);
    }

    respondSuccess(res, 200, { counts: result.data });
  } catch (err) {
    respondError(res, 500, 'SERVER_ERROR', 'Erreur de récupération des compteurs');
  }
};

// ============================================================================
// GET /api/articles/:id/reactions/me - Ma réaction personnelle
// ============================================================================

/**
 * Permet au frontend de savoir si l'utilisateur connecté a déjà réagi
 * et quelle est sa réaction (pour pré-remplir les boutons like/dislike)
 * 
 * @route GET /api/articles/:id/reactions/me
 * @access Privé (JWT requis)
 */
export const getMyReaction = async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const userId = req.user.id;

    const result = await reactionModel.getUserReaction(articleId, userId);

    if (!result.success) {
      return respondError(res, 500, 'REACTION_FETCH_FAILED', result.error);
    }

    respondSuccess(res, 200, { 
      myReaction: result.data // 'like' | 'dislike' | null
    });
  } catch (err) {
    respondError(res, 500, 'SERVER_ERROR', 'Erreur de récupération de votre réaction');
  }
};