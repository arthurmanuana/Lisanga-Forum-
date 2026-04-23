/**
 * @file auth.js
 * @description Middleware de vérification du JWT Access Token
 * @conforme PDF: Header Authorization: Bearer <token> | Format erreur standardisé
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authenticate = (req, res, next) => {
  // 1) Extraction du token depuis le header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: true,
      code: 'AUTH_TOKEN_MISSING',
      message: 'Token d\'authentification manquant ou mal formaté'
    });
  }

  const token = authHeader.split(' ')[1];

  // 2) Vérification & décryptage
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    
    // 3) Injection dans la requête pour les controllers
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    // 4) Gestion des erreurs JWT standardisée
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        code: 'AUTH_TOKEN_EXPIRED',
        message: 'Token expiré. Veuillez utiliser le refresh token ou vous reconnecter.'
      });
    }
    return res.status(403).json({
      error: true,
      code: 'AUTH_TOKEN_INVALID',
      message: 'Token invalide ou signature corrompue'
    });
  }
};