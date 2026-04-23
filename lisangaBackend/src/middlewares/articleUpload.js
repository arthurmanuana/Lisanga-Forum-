import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadDir = path.resolve(process.cwd(), 'uploads', 'articles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5 Mo

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${safeName}`);
    },
});

const fileFilter = (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error('Format image invalide. Formats autorises : JPG, PNG, WebP.')
        );
    }
    cb(null, true);
};

const uploader = multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
});

export const uploadArticleImage = uploader.single('photo');

export const handleArticleUploadError = (err, _req, res, next) => {
    if (!err) return next();

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'Image trop lourde. Taille maximale autorisee : 5 Mo.',
        });
    }

    return res.status(400).json({
        success: false,
        message: err.message || "Erreur lors de l'upload de l'image",
    });
};
