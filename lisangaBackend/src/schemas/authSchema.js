/**
 * @file authSchema.js
 * @description Schémas de validation pour l'authentification
 */

import { z } from 'zod';

export const registerSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Format d'email invalide"),
  mot_de_passe: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  nom_utilisateur: z.string().min(3).max(50).optional(),
  date_de_naissance: z.string().date("Format attendu : AAAA-MM-JJ").optional().or(z.null()),
  sexe: z.enum(['M', 'F'], { errorMap: () => ({ message: 'Doit être "M" ou "F"' }) }).optional().or(z.null())
});

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  mot_de_passe: z.string().min(1, "Le mot de passe est requis")
});