/**
 * @file articleSchema.js
 * @description Schémas de validation pour les articles et réactions
 */

import { z } from 'zod';

export const reactionSchema = z.object({
  valeur: z.enum(['like', 'dislike'], {
    errorMap: () => ({ message: 'La valeur doit être "like" ou "dislike"' })
  })
});