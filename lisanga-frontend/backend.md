# GUIDE D'INTÉGRATION BACKEND - LISANGA

## 1. Vue d'Ensemble

Ce guide explique comment remplacer les données mockées par une API Node.js/Express/PostgreSQL réelle.

### 1.1 Architecture Actuelle

```
Frontend (React) ─────► Mock Data (développement)
                           │
                           ▼
                       API Réelle (production)
```

### 1.2 Basculement vers l'API Réelle

1. Modifier `.env.local` : `VITE_USE_MOCK=false`
2. Mettre à jour `VITE_API_BASE_URL`
3. Rebuild : `npm run build`

**Aucun fichier code UI à modifier.**

---

## 2. Stack Backend Recommandée

| Technologie | Description |
|-------------|-------------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js |
| **Base de données** | PostgreSQL ou Supabase |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **Upload** | multer (images) |
| **Validation** | express-validator / Joi |

---

## 3. Structure du Backend

```
lisangaBackend/
├── src/
│   ├── config/          # Configuration DB, JWT
│   ├── controllers/      # Logique métier
│   ├── middleware/       # Auth, validation, error handling
│   ├── models/          # Schémas DB (Prisma/Sequelize)
│   ├── routes/          # Définition des routes
│   ├── services/         # Services réutilisables
│   └── server.js       # Point d'entrée
├── prisma/              # Schéma Prisma (si utilisé)
├── .env.example
├── package.json
└── README.md
```

---

## 4. Contrats API

### 4.1 Format des Réponses

**Succès :**
```json
{
  "data": { ... },
  "message": "Opération réussie"
}
```

**Erreur :**
```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Message d'erreur"
}
```

### 4.2 Authentification

#### POST /api/auth/register

**Request :**
```json
{
  "username": "jean_dupont",
  "email": "jean@example.com",
  "password": "Password123!"
}
```

**Response (201) :**
```json
{
  "userId": "uuid",
  "message": "Inscription réussie ! Vous pouvez maintenant vous connecter."
}
```

**Codes d'erreur :**
- `EMAIL_ALREADY_EXISTS` - Email déjà utilisé
- `USERNAME_ALREADY_EXISTS` - Nom d'utilisateur pris
- `VALIDATION_ERROR` - Données invalides

---

#### POST /api/auth/login

**Request :**
```json
{
  "email": "jean@example.com",
  "password": "Password123!"
}
```

**Response (200) :**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "jean_dupont",
    "email": "jean@example.com",
    "role": "user",
    "avatarUrl": null,
    "createdAt": "2026-04-21T10:00:00.000Z"
  }
}
```

**Notes :**
- Access token : 15 minutes de validité
- Refresh token : stocké dans un cookie HttpOnly (7 jours)
- Le refresh token est gérer automatiquement par le frontend via `refreshAccessToken()`

---

#### POST /api/auth/logout

**Response (200) :**
```json
{
  "message": "Déconnexion réussie"
}
```

**Notes :**
- Supprime le refresh token cookie
- Optionnel : blacklister le token côté serveur

---

#### GET /api/auth/profile

**Headers :**
```
Authorization: Bearer <accessToken>
```

**Response (200) :**
```json
{
  "user": {
    "id": "uuid",
    "username": "jean_dupont",
    "email": "jean@example.com",
    "role": "user",
    "avatarUrl": null,
    "createdAt": "2026-04-21T10:00:00.000Z"
  }
}
```

**Codes d'erreur :**
- `UNAUTHORIZED` - Token manquant ou invalide
- `TOKEN_EXPIRED` - Token expiré

---

#### POST /api/auth/refresh

**Cookies :**
```
httpOnly: true
Cookie: refreshToken=<token>
```

**Response (200) :**
```json
{
  "accessToken": "nouveau_access_token"
}
```

---

### 4.3 Articles

#### GET /api/articles

**Query Parameters :**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| category | string | "" | Filtrer par catégorie |
| search | string | "" | Recherche textuelle (titre + contenu) |
| sort | string | "recent" | Tri : recent, popular, commented |
| page | number | 1 | Numéro de page |
| limit | number | 9 | Articles par page |

**Note :** Le frontend peut également appeler un endpoint optionnel `GET /api/articles/category-counts` pour récupérer le nombre d'articles par catégorie et enrichir l'interface de filtres.

**Response (200) :**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Introduction à React 18",
      "excerpt": "React 18 apporte...",
      "imageUrl": "https://example.com/image.jpg",
      "category": "Technologie",
      "author": {
        "id": "uuid",
        "username": "marie_dubois",
        "avatarUrl": null
      },
      "likesCount": 42,
      "dislikesCount": 3,
      "commentsCount": 12,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "updatedAt": "2026-04-18T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalArticles": 42,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### GET /api/articles/:id

**Response (200) :**
```json
{
  "article": {
    "id": "uuid",
    "title": "Introduction à React 18",
    "content": "Contenu complet de l'article...",
    "excerpt": "React 18 apporte...",
    "imageUrl": "https://example.com/image.jpg",
    "category": "Technologie",
    "author": {
      "id": "uuid",
      "username": "marie_dubois",
      "email": "marie@example.com",
      "avatarUrl": null,
      "role": "user"
    },
    "likesCount": 42,
    "dislikesCount": 3,
    "commentsCount": 12,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:30:00.000Z"
  }
}
```

**Codes d'erreur :**
- `NOT_FOUND` - Article non trouvé

---

#### POST /api/articles

**Headers :**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Body (FormData) :**
| Field | Type | Required | Description |
|-------|------|---------|-------------|
| title | string | Oui | Titre de l'article (10-200 car.) |
| content | string | Oui | Contenu (100-10000 car.) |
| category | string | Oui | Catégorie |
| image | file | Non | Image de couverture (max 5 Mo) |

**Response (201) :**
```json
{
  "article": {
    "id": "uuid",
    "title": "Nouveau titre",
    "content": "Nouveau contenu...",
    "excerpt": "Extrait automatique...",
    "imageUrl": "https://example.com/uploads/image.jpg",
    "category": "Technologie",
    "author": { ... },
    "likesCount": 0,
    "dislikesCount": 0,
    "commentsCount": 0,
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T10:00:00.000Z"
  },
  "message": "Article publié avec succès"
}
```

**Codes d'erreur :**
- `UNAUTHORIZED` - Non connecté
- `VALIDATION_ERROR` - Données invalides
- `FILE_TOO_LARGE` - Image > 5 Mo
- `INVALID_FILE_TYPE` - Format non supporté

---

#### PUT /api/articles/:id

**Headers :**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Body (FormData) :**
| Field | Type | Required | Description |
|-------|------|---------|-------------|
| title | string | Oui | Titre |
| content | string | Oui | Contenu |
| category | string | Oui | Catégorie |
| image | file | Non | Nouvelle image (remplace l'ancienne) |

**Response (200) :**
```json
{
  "message": "Article mis à jour avec succès"
}
```

**Codes d'erreur :**
- `UNAUTHORIZED` - Non connecté
- `FORBIDDEN` - Pas le propriétaire ni admin
- `NOT_FOUND` - Article non trouvé

---

#### DELETE /api/articles/:id

**Headers :**
```
Authorization: Bearer <accessToken>
```

**Response (200) :**
```json
{
  "message": "Article supprimé avec succès"
}
```

**Codes d'erreur :**
- `UNAUTHORIZED` - Non connecté
- `FORBIDDEN` - Pas le propriétaire ni admin
- `NOT_FOUND` - Article non trouvé

---

### 4.4 Like/Dislike

#### POST /api/articles/:id/like

**Headers :**
```
Authorization: Bearer <accessToken>
```

**Response (200) :**
```json
{
  "action": "liked",
  "vote": "like"
}
```

**Notes :**
- Si déjà liké → retire le like (action: "removed", vote: null)
- Si déjà disliké → change en like

---

#### POST /api/articles/:id/dislike

**Headers :**
```
Authorization: Bearer <accessToken>
```

**Response (200) :**
```json
{
  "action": "disliked",
  "vote": "dislike"
}
```

**Notes :**
- Si déjà disliké → retire le dislike
- Si déjà liké → change en dislike

---

### 4.5 Commentaires

#### GET /api/articles/:articleId/comments

**Response (200) :**
```json
{
  "comments": [
    {
      "id": "uuid",
      "content": "Excellent article !",
      "author": {
        "id": "uuid",
        "username": "jean_martin",
        "avatarUrl": null
      },
      "articleId": "article-uuid",
      "parentId": null,
      "replies": [
        {
          "id": "uuid",
          "content": "Tout à fait d'accord !",
          "author": { ... },
          "articleId": "article-uuid",
          "parentId": "comment-uuid",
          "replies": [],
          "createdAt": "2026-04-18T12:15:00.000Z"
        }
      ],
      "createdAt": "2026-04-18T11:45:00.000Z"
    }
  ]
}
```

---

#### POST /api/articles/:articleId/comments

**Headers :**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request :**
```json
{
  "content": "Mon commentaire...",
  "parentId": null
}
```

**Response (201) :**
```json
{
  "comment": {
    "id": "uuid",
    "content": "Mon commentaire...",
    "author": {
      "id": "uuid",
      "username": "current_user",
      "avatarUrl": null
    },
    "articleId": "article-uuid",
    "parentId": null,
    "replies": [],
    "createdAt": "2026-04-21T10:00:00.000Z"
  },
  "message": "Commentaire ajouté avec succès"
}
```

**Codes d'erreur :**
- `UNAUTHORIZED` - Non connecté
- `VALIDATION_ERROR` - Contenu invalide (1-1000 car.)
- `NOT_FOUND` - Article non trouvé

---

#### DELETE /api/comments/:id

**Headers :**
```
Authorization: Bearer <accessToken>
```

**Response (200) :**
```json
{
  "message": "Commentaire supprimé avec succès"
}
```

**Codes d'erreur :**
- `UNAUTHORIZED` - Non connecté
- `FORBIDDEN` - Pas le propriétaire ni admin
- `NOT_FOUND` - Commentaire non trouvé

---

### 4.6 Admin Dashboard

#### GET /api/admin/stats

**Headers :**
```
Authorization: Bearer <accessToken>
```

**Response (200) :**
```json
{
  "stats": {
    "totalUsers": 150,
    "totalArticles": 89,
    "totalComments": 342,
    "totalLikes": 1250,
    "recentArticles": [ ... ],
    "topAuthors": [ ... ]
  }
}
```

**Notes :**
- Accessible uniquement aux utilisateurs avec `role: "admin"`

#### GET /api/admin/categories

**Response (200) :**
```json
{
  "categories": [
    { "id": 1, "name": "Technologie", "slug": "technologie", "description": "..." }
  ]
}
```

#### POST /api/admin/categories

Permet a l'admin de predefinir une categorie utilisable lors de la creation d'articles.

#### DELETE /api/admin/categories/:id

Permet a l'admin de retirer une categorie predefinie.

---

## 5. Schéma de Base de Données

### 5.1 Tables Principales

```sql
-- Table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user', -- 'user' ou 'admin'
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(255),
  image_url TEXT,
  category VARCHAR(50) NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commentaires
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des votes (like/dislike)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL, -- 'like' ou 'dislike'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, article_id)
);

-- Table pour les refresh tokens (si stockage DB)
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 Index Recommandés

```sql
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published ON articles(created_at DESC);
CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_votes_article ON votes(article_id);
CREATE INDEX idx_votes_user ON votes(user_id);
```

---

## 6. Sécurité

### 6.1 Authentification

```javascript
// Middleware de vérification du token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: true,
      code: 'UNAUTHORIZED',
      message: 'Token requis'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        code: 'TOKEN_EXPIRED',
        message: 'Token expiré'
      });
    }
    return res.status(401).json({
      error: true,
      code: 'INVALID_TOKEN',
      message: 'Token invalide'
    });
  }
};

// Middleware de vérification admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: true,
      code: 'FORBIDDEN',
      message: 'Accès réservé aux administrateurs'
    });
  }
  next();
};
```

### 6.2 Validation des Entrées

```javascript
const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username: 3-20 caractères alphanumériques'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password: 8+ caractères, 1 maj, 1 min, 1 chiffre, 1 spécial')
];

const articleValidation = [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Titre: 10-200 caractères'),
  body('content')
    .trim()
    .isLength({ min: 100, max: 10000 })
    .withMessage('Contenu: 100-10000 caractères'),
  body('category')
    .isIn(['Technologie', 'Business', 'Design', 'Communauté', 'Formation', 'Événement', 'Culture', 'Société'])
    .withMessage('Catégorie invalide')
];

// Utilisation
router.post('/register', registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      code: 'VALIDATION_ERROR',
      message: errors.array()[0].msg
    });
  }
  // ...
});
```

### 6.3 Upload d'Images

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format non supporté'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo
});
```

---

## 7. Structure des Fichiers Backend

### 7.1 Point d'entrée (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### 7.2 Routes Example (articles.js)

```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const articleController = require('../controllers/articleController');

// GET /api/articles
router.get('/', articleController.getArticles);

// GET /api/articles/:id
router.get('/:id', articleController.getArticleById);

// POST /api/articles (protected, avec upload image)
router.post('/',
  authMiddleware,
  upload.single('image'),
  [
    body('title').trim().isLength({ min: 10, max: 200 }),
    body('content').trim().isLength({ min: 100, max: 10000 }),
    body('category').isIn(['Technologie', 'Business', ...])
  ],
  articleController.createArticle
);

// PUT /api/articles/:id (protected)
router.put('/:id', authMiddleware, articleController.updateArticle);

// DELETE /api/articles/:id (protected)
router.delete('/:id', authMiddleware, articleController.deleteArticle);

// POST /api/articles/:id/like (protected)
router.post('/:id/like', authMiddleware, articleController.likeArticle);

// POST /api/articles/:id/dislike (protected)
router.post('/:id/dislike', authMiddleware, articleController.dislikeArticle);

module.exports = router;
```

---

## 8. Checklist de Livraison Backend

Avant de considérer le backend comme prêt :

- [ ] Tous les endpoints retournent le format JSON exact défini
- [ ] Les erreurs suivent le format standard `{ error, code, message }`
- [ ] L'authentification JWT fonctionne (login → token → accès routes protégées)
- [ ] Les rôles user et admin sont gérés
- [ ] La pagination fonctionne sur les listes
- [ ] Les uploads d'images sont validés (taille max 5Mo, formats JPG/PNG/WebP)
- [ ] Les requêtes SQL sont optimisées (indexes sur published_at, author_id, etc.)
- [ ] Un compte admin est créé par défaut (seed)
- [ ] La collection Postman est fournie
- [ ] Le README est complet et clair

---

## 9. Variables d'Environnement Backend

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lisanga

# JWT
JWT_SECRET=votre_secret_tres_securise
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

---

## 10. Notes d'Implémentation

### 10.1 Gestion des Votes

Le frontend stocke les votes en localStorage avec la clé `lisanga_vote_{articleId}`. 

Côté backend, la table `votes` avec contrainte UNIQUE garantit qu'un utilisateur ne peut avoir qu'un seul vote par article.

```sql
UNIQUE(user_id, article_id)
```

### 10.2 Compteurs Dénormalisés

Pour optimiser les performances, les compteurs (`likes_count`, `dislikes_count`, `comments_count`) sont stockés directement sur la table `articles`. 

Les triggers ou l'application doivent les maintenir à jour :

```sql
-- Trigger PostgreSQL exemple pour likes
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE articles SET likes_count = likes_count + 1 WHERE id = NEW.article_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE articles SET likes_count = likes_count - 1 WHERE id = OLD.article_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### 10.3 Soft Delete vs Hard Delete

- Articles : Hard delete (suppression complète)
- Commentaires : Hard delete (pas d'édition en MVP)
- Utilisateurs : Soft delete (`is_active = false`) avec bannissement

---

## 11. Tests Postman

Une collection Postman est recommandée avec :

- **Auth**
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/profile
  - POST /api/auth/refresh
  - POST /api/auth/logout

- **Articles**
  - GET /api/articles
  - GET /api/articles/:id
  - POST /api/articles (protected)
  - PUT /api/articles/:id (protected)
  - DELETE /api/articles/:id (protected)
  - POST /api/articles/:id/like (protected)
  - POST /api/articles/:id/dislike (protected)

- **Comments**
  - GET /api/articles/:id/comments
  - POST /api/articles/:id/comments (protected)
  - DELETE /api/comments/:id (protected)

- **Admin**
  - GET /api/admin/stats (admin only)

---

*Dernière mise à jour : Avril 2026*
