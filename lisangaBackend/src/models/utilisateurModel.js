/**
 * @file utilisateurModel.js
 * @description Couche d'accès aux données pour la table 'utilisateurs'
 * @author Lisanga Team
 * @version 1.0.0
 */

import { pool } from '../db/pool.js';

// ============================================================================
// ⚙️ CONSTANTES DE CONFIGURATION
// ============================================================================

/**
 * Liste blanche des champs autorisés en mise à jour
 * 🔒 Sécurité : empêche la modification de champs sensibles comme 'role' ou 'mot_de_passe'
 * via cette méthode générique. Pour changer le mot de passe, utiliser une méthode dédiée.
 */
const ALLOWED_UPDATE_FIELDS = [
  'nom',
  'prenom',
  'nom_utilisateur',
  'photo',
  'date_de_naissance',
  'sexe'
  // Note : 'email' et 'role' sont exclus car ils nécessitent une logique métier spécifique
];

/**
 * Liste des colonnes publiques à retourner aux clients
 * 🔒 Sécurité : exclut systématiquement 'mot_de_passe' et autres données sensibles
 */
const PUBLIC_USER_COLUMNS = `
  id_utilisateurs,
  nom,
  prenom,
  nom_utilisateur,
  email,
  role,
  photo,
  date_de_naissance,
  sexe,
  created_at,
  updated_at
`;

// ============================================================================
// 🔍 MÉTHODES DE LECTURE (READ)
// ============================================================================

/**
 * Trouver un utilisateur par son email
 * @param {string} email - L'email de l'utilisateur à rechercher
 * @returns {Promise<Object|null>} L'objet utilisateur complet (pour vérification login) OU null si non trouvé
 * @throws {Error} En cas d'erreur de connexion à la base de données
 * 
 * @example
 * const user = await findByEmail('paul@example.com');
 * if (user) { /* vérifier le mot de passe *\/ }
 */
export const findByEmail = async (email) => {
  try {
    // On sélectionne TOUTES les colonnes ici car on en a besoin pour bcrypt.compare()
    // Mais cette fonction ne doit JAMAIS être exposée directement dans une réponse HTTP
    const query = 'SELECT * FROM utilisateurs WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    return result.rows[0] || null;
  } catch (err) {
    // Log interne pour le débogage (ne pas exposer à l'utilisateur)
    console.error('[DB] Erreur findByEmail:', err.message);
    throw new Error('Erreur de consultation de la base de données');
  }
};

/**
 * Trouver un utilisateur public par son ID (sans données sensibles)
 * @param {number} id - L'ID de l'utilisateur
 * @returns {Promise<Object|null>} L'objet utilisateur avec uniquement les colonnes publiques
 * 
 * @example
 * const profile = await findPublicById(42);
 * res.json(profile); // Safe à envoyer au frontend
 */
export const findPublicById = async (id) => {
  try {
    const query = `SELECT ${PUBLIC_USER_COLUMNS} FROM utilisateurs WHERE id_utilisateurs = $1`;
    const result = await pool.query(query, [id]);
    
    return result.rows[0] || null;
  } catch (err) {
    console.error('[DB] Erreur findPublicById:', err.message);
    throw new Error('Erreur de consultation du profil');
  }
};

/**
 * Trouver un utilisateur public par son nom d'utilisateur (@pseudo)
 * @param {string} nom_utilisateur - Le pseudo de l'utilisateur
 * @returns {Promise<Object|null>} Profil public ou null
 */
export const findPublicByUsername = async (nom_utilisateur) => {
  try {
    const query = `SELECT ${PUBLIC_USER_COLUMNS} FROM utilisateurs WHERE nom_utilisateur = $1`;
    const result = await pool.query(query, [nom_utilisateur]);
    
    return result.rows[0] || null;
  } catch (err) {
    console.error('[DB] Erreur findPublicByUsername:', err.message);
    throw new Error('Erreur de recherche d\'utilisateur');
  }
};

/**
 * Vérifier si un email existe déjà dans la base
 * @param {string} email - Email à vérifier
 * @returns {Promise<boolean>} true si l'email existe, false sinon
 */
export const emailExists = async (email) => {
  try {
    const query = 'SELECT 1 FROM utilisateurs WHERE email = $1 LIMIT 1';
    const result = await pool.query(query, [email]);
    
    return result.rows.length > 0;
  } catch (err) {
    console.error('[DB] Erreur emailExists:', err.message);
    throw new Error('Erreur de vérification d\'email');
  }
};

/**
 * Vérifier si un nom d'utilisateur existe déjà
 * @param {string} nom_utilisateur - Pseudo à vérifier
 * @returns {Promise<boolean>} true si le pseudo existe, false sinon
 */
export const usernameExists = async (nom_utilisateur) => {
  try {
    const query = 'SELECT 1 FROM utilisateurs WHERE nom_utilisateur = $1 LIMIT 1';
    const result = await pool.query(query, [nom_utilisateur]);
    
    return result.rows.length > 0;
  } catch (err) {
    console.error('[DB] Erreur usernameExists:', err.message);
    throw new Error('Erreur de vérification de pseudo');
  }
};

// ============================================================================
// ➕ MÉTHODE DE CRÉATION (CREATE)
// ============================================================================

/**
 * Créer un nouvel utilisateur dans la base de données
 * @param {Object} userData - Données de l'utilisateur
 * @param {string} userData.nom - Nom de famille
 * @param {string} userData.prenom - Prénom
 * @param {string} userData.email - Email (doit être unique)
 * @param {string} userData.nom_utilisateur - Pseudo (optionnel, doit être unique)
 * @param {string} userData.mot_de_passe - Mot de passe DÉJÀ HASHÉ (par bcrypt)
 * @param {string} [userData.date_de_naissance] - Date de naissance (optionnel)
 * @param {'M'|'F'} [userData.sexe] - Sexe (optionnel, limité par CHECK constraint)
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>} Résultat de l'opération
 * 
 * @example
 * const result = await create({
 *   nom: 'Diallo',
 *   prenom: 'Aminata',
 *   email: 'amina@example.com',
 *   mot_de_passe: hashedPassword // ⚠️ Toujours hasher avant d'appeler cette fonction
 * });
 * if (result.success) { /* envoyer email de bienvenue *\/ }
 */
export const create = async (userData) => {
  try {
    const {
      nom,
      prenom,
      email,
      nom_utilisateur = null,
      mot_de_passe,
      date_de_naissance = null,
      sexe = null
    } = userData;

    // Requête avec RETURNING pour récupérer l'utilisateur créé avec les colonnes publiques
    const query = `
      INSERT INTO utilisateurs (
        nom, prenom, email, nom_utilisateur, 
        mot_de_passe, date_de_naissance, sexe
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING ${PUBLIC_USER_COLUMNS}
    `;
    
    const values = [
      nom,
      prenom,
      email,
      nom_utilisateur,
      mot_de_passe, // ⚠️ Doit être déjà hashé par le controller
      date_de_naissance,
      sexe
    ];

    const result = await pool.query(query, values);
    
    return {
      success: true,
      user: result.rows[0]
    };

  } catch (err) {
    // 🎯 Gestion spécifique des erreurs PostgreSQL
    if (err.code === '23505') { // unique_violation
      // Identifier quelle contrainte a été violée
      if (err.constraint === 'utilisateurs_email_key') {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }
      if (err.constraint === 'utilisateurs_nom_utilisateur_key') {
        return { success: false, error: 'Ce nom d\'utilisateur est déjà pris' };
      }
      // Fallback générique si la contrainte n'est pas identifiée
      return { success: false, error: 'Un compte avec ces informations existe déjà' };
    }
    
    // Erreur de contrainte CHECK (ex: sexe invalide)
    if (err.code === '23514') { // check_violation
      return { success: false, error: 'Données invalides : vérifiez les champs saisis' };
    }

    // Log interne pour l'équipe technique
    console.error('[DB] Erreur create utilisateur:', err.message);
    
    // Réponse sécurisée pour le client (ne jamais exposer le message d'erreur SQL brut)
    return { success: false, error: 'Erreur lors de la création du compte' };
  }
};

// ============================================================================
// ✏️ MÉTHODE DE MISE À JOUR (UPDATE)
// ============================================================================

/**
 * Mettre à jour les informations publiques d'un utilisateur
 * @param {number} id - ID de l'utilisateur à modifier
 * @param {Object} updateData - Données à mettre à jour (seuls les champs dans ALLOWED_UPDATE_FIELDS seront appliqués)
 * @param {string} [updateData.nom] 
 * @param {string} [updateData.prenom]
 * @param {string} [updateData.nom_utilisateur]
 * @param {string} [updateData.photo]
 * @param {string} [updateData.date_de_naissance]
 * @param {'M'|'F'} [updateData.sexe]
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>} Résultat de l'opération
 * 
 * @example
 * const result = await update(42, { nom: 'NouveauNom', photo: 'url_avatar.jpg' });
 * if (result.success) { /* mettre à jour le frontend *\/ }
 */
export const update = async (id, updateData) => {
  try {
    // 🛡️ Filtrage strict : on ne garde QUE les champs autorisés
    // Cela empêche un attaquant d'envoyer { role: 'admin' } pour se promouvoir
    const allowedUpdates = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        allowedUpdates[field] = updateData[field];
      }
    }

    // Si aucun champ valide à mettre à jour, on retourne l'utilisateur actuel
    if (Object.keys(allowedUpdates).length === 0) {
      const current = await findPublicById(id);
      return { success: true, user: current };
    }

    // Construction dynamique et sécurisée de la requête UPDATE
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [field, value] of Object.entries(allowedUpdates)) {
      setClauses.push(`${field} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    // Ajout de updated_at et de la clause WHERE
    values.push(id);
    const query = `
      UPDATE utilisateurs 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id_utilisateurs = $${paramIndex}
      RETURNING ${PUBLIC_USER_COLUMNS}
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    return {
      success: true,
      user: result.rows[0]
    };

  } catch (err) {
    // Gestion des erreurs de contrainte UNIQUE (pseudo déjà pris lors d'un update)
    if (err.code === '23505' && err.constraint === 'utilisateurs_nom_utilisateur_key') {
      return { success: false, error: 'Ce nom d\'utilisateur est déjà utilisé par un autre compte' };
    }

    // Gestion des contraintes CHECK (sexe invalide, etc.)
    if (err.code === '23514') {
      return { success: false, error: 'Modification refusée : donnée invalide' };
    }

    // Gestion des erreurs de clé étrangère (ex: suppression liée)
    if (err.code === '23503') { // foreign_key_violation
      console.warn('[DB] Violation de clé étrangère sur update utilisateur:', err.message);
      return { success: false, error: 'Impossible de modifier : dépendances existantes' };
    }

    console.error('[DB] Erreur update utilisateur:', err.message);
    return { success: false, error: 'Erreur lors de la mise à jour du profil' };
  }
};

// ============================================================================
// 🔐 MÉTHODES SPÉCIALISÉES (SÉCURITÉ)
// ============================================================================

/**
 * Mettre à jour uniquement le mot de passe d'un utilisateur
 * @param {number} id - ID de l'utilisateur
 * @param {string} hashedPassword - Nouveau mot de passe DÉJÀ HASHÉ par bcrypt
 * @returns {Promise<{success: boolean, error?: string}>} Résultat de l'opération
 * 
 * @note Cette méthode est séparée pour une meilleure traçabilité et sécurité
 */
export const updatePassword = async (id, hashedPassword) => {
  try {
    const query = `
      UPDATE utilisateurs 
      SET mot_de_passe = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id_utilisateurs = $2
    `;
    
    const result = await pool.query(query, [hashedPassword, id]);
    
    if (result.rowCount === 0) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    return { success: true };
  } catch (err) {
    console.error('[DB] Erreur updatePassword:', err.message);
    return { success: false, error: 'Erreur lors du changement de mot de passe' };
  }
};

/**
 * Supprimer un utilisateur (soft delete recommandé en production)
 * @param {number} id - ID de l'utilisateur à supprimer
 * @returns {Promise<{success: boolean, error?: string}>} Résultat de l'opération
 * 
 * @warning La suppression est CASCADE : articles, commentaires et réactions seront aussi supprimés
 *          (voir contraintes ON DELETE CASCADE dans le schéma SQL)
 */
export const remove = async (id) => {
  try {
    // Option 1 : Suppression physique (avec CASCADE)
    const query = 'DELETE FROM utilisateurs WHERE id_utilisateurs = $1 RETURNING id_utilisateurs';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    return { success: true };

    // Option 2 (recommandée) : Soft delete
    // 1. Ajouter une colonne 'deleted_at TIMESTAMP NULL' à la table
    // 2. Remplacer par: UPDATE utilisateurs SET deleted_at = NOW() WHERE id = $1
    // 3. Ajouter 'AND deleted_at IS NULL' à toutes les requêtes SELECT
  } catch (err) {
    // Erreur de clé étrangère (si CASCADE n'est pas configuré correctement)
    if (err.code === '23503') {
      return { success: false, error: 'Impossible de supprimer : des données liées existent' };
    }

    console.error('[DB] Erreur remove utilisateur:', err.message);
    return { success: false, error: 'Erreur lors de la suppression du compte' };
  }
};

// ============================================================================
// 📊 MÉTHODES UTILITAIRES
// ============================================================================

/**
 * Compter le nombre total d'utilisateurs (pour stats admin)
 * @param {Object} [filters] - Filtres optionnels
 * @param {string} [filters.role] - Filtrer par rôle ('admin' ou 'utilisateur')
 * @returns {Promise<number>} Nombre d'utilisateurs correspondant aux critères
 */
export const count = async (filters = {}) => {
  try {
    let query = 'SELECT COUNT(*)::integer as total FROM utilisateurs';
    const values = [];
    const conditions = [];

    if (filters.role) {
      conditions.push(`role = $${values.length + 1}`);
      values.push(filters.role);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const result = await pool.query(query, values);
    return result.rows[0].total;
  } catch (err) {
    console.error('[DB] Erreur count utilisateurs:', err.message);
    throw new Error('Erreur de comptage des utilisateurs');
  }
};

/**
 * Rechercher des utilisateurs publics (pour autocomplete, mentions, etc.)
 * @param {string} searchTerm - Terme de recherche (nom, prénom ou pseudo)
 * @param {number} [limit=10] - Nombre maximum de résultats
 * @returns {Promise<Array<Object>>} Liste d'utilisateurs publics
 */
export const searchPublic = async (searchTerm, limit = 10) => {
  try {
    const query = `
      SELECT ${PUBLIC_USER_COLUMNS}
      FROM utilisateurs
      WHERE 
        nom ILIKE $1 OR 
        prenom ILIKE $1 OR 
        nom_utilisateur ILIKE $1
      ORDER BY nom, prenom
      LIMIT $2
    `;
    
    const result = await pool.query(query, [`%${searchTerm}%`, limit]);
    return result.rows;
  } catch (err) {
    console.error('[DB] Erreur searchPublic:', err.message);
    throw new Error('Erreur de recherche d\'utilisateurs');
  }
};