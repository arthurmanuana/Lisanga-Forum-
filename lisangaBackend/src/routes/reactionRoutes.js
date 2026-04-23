/**
 * @file reactionRoutes.js
 * @description Routes de gestion des réactions (like/dislike) sur les articles
 * @conforme PDF: POST /api/articles/:id/like | Format réponse standardisé | JWT requis
 * @note Ces routes sont montées sous /api/articles pour correspondre au contrat frontend
 */

import { Router } from 'express';
import * as reactionController from '../controllers/reactionController.js';
import { authenticate } from '../middlewares/auth.js';

import { validate } from '../middlewares/validate.js';
import { reactionSchema } from '../schemas/articleSchema.js';

const router = Router();


// ============================================================================
// Routes protégées (nécessitent un JWT valide)
// ============================================================================

/**
 * POST /api/articles/:id/like
 * Toggle like/dislike sur un article
 * Body attendu: { "valeur": "like" | "dislike" }
 */
router.post('/:id/like', authenticate, validate(reactionSchema), reactionController.toggleReaction);

/**
 * DELETE /api/articles/:id/like
 * Retirer sa réaction sur un article
 */
router.delete('/:id/like', authenticate, reactionController.removeReaction);

/**
 * GET /api/articles/:id/reactions/me
 * Récupérer MA réaction personnelle sur un article (pour pré-remplir l'UI)
 */
router.get('/:id/reactions/me', authenticate, reactionController.getMyReaction);

// ============================================================================
// Route publique (pas d'auth requise)
// ============================================================================

/**
 * GET /api/articles/:id/reactions
 * Compter les likes/dislikes d'un article (affiché à tous les visiteurs)
 */
router.get('/:id/reactions', reactionController.getReactionCounts);


export default router;