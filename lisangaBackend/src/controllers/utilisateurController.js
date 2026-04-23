/**
 * @file utilisateurController.js
 * @description Gestion du profil utilisateur (lecture, mise à jour, changement de mot de passe)
 * @stack Express 5, ESM, bcryptjs
 * @note Ce controller suppose qu'un middleware d'authentification a déjà vérifié le JWT
 *       et injecté req.user = { id, email, role }
 */
import fs from 'fs';
import path from 'path';
import { findPublicById, update, updatePassword, findByEmail } from '../models/utilisateurModel.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';

/**
 * PUT /api/users/me/photo
 * Gère l'upload, nettoie l'ancienne photo, met à jour la BDD
 */
export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return respondError(res, 400, 'NO_FILE_UPLOADED', 'Aucune image n\'a été envoyée');
    }

    // Supprimer l'ancienne photo si elle existe localement
    const currentUser = await findPublicById(req.user.id);
    if (currentUser?.photo?.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(process.cwd(), currentUser.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Chemin public stocké en BDD
    const photoPath = `/uploads/avatars/${req.file.filename}`;
    const result = await update(req.user.id, { photo: photoPath });

    if (!result.success) {
      return respondError(res, 400, 'UPDATE_FAILED', result.error);
    }

    respondSuccess(res, 200, { user: result.user }, 'Photo de profil mise à jour');
  } catch (err) {
    // Multer envoie ses erreurs ici. On les formate au standard PDF.
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return respondError(res, 413, 'FILE_TOO_LARGE', 'L\'image ne doit pas dépasser 5 Mo.');
      }
    }
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de l\'upload de la photo');
  }
};

// ============================================================================
// HELPERS STANDARDISÉS (Conformes au PDF)
// ============================================================================

/**
 * Format de réponse d'erreur imposé par le guide d'intégration
 * @param {Response} res 
 * @param {number} status 
 * @param {string} code - Code technique pour le frontend
 * @param {string} message - Message lisible pour l'utilisateur
 */
const respondError = (res, status, code, message) => 
  res.status(status).json({ error: true, code, message });

/**
 * Format de réponse succès standardisé
 */
const respondSuccess = (res, status, data = {}, message = 'Opération réussie') => 
  res.status(status).json({ data, message });

// ============================================================================
// GET /api/users/me - Profil de l'utilisateur connecté
// ============================================================================

export const getProfile = async (req, res) => {
  try {
    // req.user.id provient du middleware JWT
    const user = await findPublicById(req.user.id);
    
    if (!user) {
      return respondError(res, 404, 'USER_NOT_FOUND', 'Utilisateur non trouvé');
    }

    // Retourne exactement le format attendu par le frontend
    res.status(200).json({ data: { user }, message: 'Profil récupéré' });
  } catch (err) {
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la récupération du profil');
  }
};

// ============================================================================
// PUT /api/users/me - Mise à jour du profil
// ============================================================================

export const updateProfile = async (req, res) => {
  try {
    // Le modèle filtre déjà les champs autorisés (whitelist)
    const result = await update(req.user.id, req.body);

    if (!result.success) {
      // Mappe les erreurs du modèle vers le format PDF
      return respondError(res, 400, 'UPDATE_FAILED', result.error);
    }

    respondSuccess(res, 200, { user: result.user }, 'Profil mis à jour avec succès');
  } catch (err) {
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors de la mise à jour du profil');
  }
};

// ============================================================================
// PUT /api/users/me/password - Changement de mot de passe
// ============================================================================

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1) Validation basique des champs
    if (!currentPassword || !newPassword) {
      return respondError(res, 400, 'MISSING_FIELDS', 'Les champs currentPassword et newPassword sont requis');
    }

    // 2) Récupération du hash actuel (utilise findByEmail car le token contient l'email)
    const userSecure = await findByEmail(req.user.email);
    if (!userSecure) {
      return respondError(res, 401, 'AUTH_REQUIRED', 'Utilisateur introuvable');
    }

    // 3) Vérification de l'ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, userSecure.mot_de_passe);
    if (!isMatch) {
      return respondError(res, 401, 'INVALID_CURRENT_PASSWORD', 'Le mot de passe actuel est incorrect');
    }

    // 4) Validation de complexité (optionnel mais recommandé)
    if (newPassword.length < 8) {
      return respondError(res, 400, 'WEAK_PASSWORD', 'Le nouveau mot de passe doit contenir au moins 8 caractères');
    }

    // 5) Hash & Mise à jour
    const hashedNew = await bcrypt.hash(newPassword, 10);
    const result = await updatePassword(userSecure.id_utilisateurs, hashedNew);

    if (!result.success) {
      return respondError(res, 400, 'PASSWORD_UPDATE_FAILED', result.error);
    }

    // Bonne pratique : invalider les refresh tokens existants après un changement de mdp
    // (À implémenter si tu utilises une table de tokens blacklistés ou version incrémentale dans le JWT)
    respondSuccess(res, 200, {}, 'Mot de passe modifié avec succès');
  } catch (err) {
    respondError(res, 500, 'SERVER_ERROR', 'Erreur lors du changement de mot de passe');
  }
};