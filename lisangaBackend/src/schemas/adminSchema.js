/**
 * @file adminSchema.js
 * @description Schémas de validation pour les routes admin
 */

import { z } from 'zod';

export const categorySchema = {
  create: z.object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
    description: z.string().max(500).optional().or(z.null())
  }),
  update: z.object({
    nom: z.string().min(2).max(50).optional(),
    description: z.string().max(500).optional().or(z.null())
  })
};