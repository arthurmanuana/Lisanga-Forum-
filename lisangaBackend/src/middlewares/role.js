/**
 * @file role.js
 * @description Middleware de vérification des rôles (user, admin, etc.)
 * @usage: router.get('/admin', authenticate, authorizeRoles('admin'), adminController);
 */

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      // req.user est injecté par le middleware authenticate()
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: true,
          code: 'AUTH_FORBIDDEN',
          message: `Accès refusé. Rôle requis : ${allowedRoles.join(' ou ')}`
        });
      }
      next();
    };
  };