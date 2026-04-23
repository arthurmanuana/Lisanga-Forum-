/**
 * @file validate.js
 * @description Middleware de validation des entrées avec Zod
 * @conforme PDF: Format d'erreur standard { error, code, message }
 * @usage: router.post('/login', validate(loginSchema), controller.login);
 */

import { ZodError } from 'zod';

/**
 * Crée un middleware qui valide `req.body` contre un schéma Zod.
 * En cas d'erreur, renvoie le format exigé par le guide et bloque la requête.
 * @param {import('zod').ZodObject} schema - Schéma Zod à appliquer
 * @returns {import('express').RequestHandler}
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Nettoie et valide les données
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Prend la première erreur pour un message clair
        const issues = err.issues || err.errors || [];
        const firstError = issues[0];

        if (!firstError) {
          return res.status(400).json({
            error: true,
            code: 'VALIDATION_ERROR',
            message: 'Données invalides'
          });
        }

        const field = firstError.path?.length ? firstError.path.join('.') : 'body';
        const message = `${field} : ${firstError.message}`;

        return res.status(400).json({
          error: true,
          code: 'VALIDATION_ERROR',
          message
        });
      }
      // Erreur inattendue (ex: schéma mal configuré)
      next(err);
    }
  };
};