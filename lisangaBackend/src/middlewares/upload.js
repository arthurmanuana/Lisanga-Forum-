/**
 * @file upload.js
 * @description Middleware de gestion d'upload pour la photo de profil
 * @conforme PDF: Max 5Mo | Formats: JPG, JPEG, PNG, WebP
 */
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Dossier de stockage (créé automatiquement si absent)
const AVATAR_DIR = './uploads/avatars';
if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true });

// 2. Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

// 3. Filtre de validation (MIME + extension)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format invalide. Seuls JPG, PNG et WebP sont acceptés.'), false);
  }
};

// 4. Export du middleware (champ attendu: 'photo')
export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo
}).single('photo');