# LISANGA - Documentation Complète du Projet

## 1. Présentation Générale

### 1.1 Description du Projet

**Lisanga** est une plateforme moderne de publication et débat communautaire développée par **NuruTech**. Elle permet aux utilisateurs de publier des articles, d'interagir via un système de commentaires à deux niveaux, et de voter (like/dislike) sur le contenu.

### 1.2 Objectifs

- Permettre la publication d'articles avec images de couverture
- Offrir un système de like/dislike binaire
- Faciliter les discussions via commentaires à 2 niveaux
- Proposer une interface responsive avec mode clair/sombre
- Fournir un dashboard admin pour la modération

### 1.3 Stack Technique

| Technologie | Description |
|-------------|-------------|
| **Frontend** | React 18+ / Vite / CSS Pur / React Router v6+ |
| **State Management** | Context API |
| **Styling** | CSS Variables + Design System personnalisé |
| **Mode** | Clair/Sombre sans rechargement |

### 1.4 Méthode de Développement

- Travail initial avec mocks JSON → basculement vers API réelle
- Contrat API strict : JSON camelCase, UUID, dates ISO 8601
- Aucune refonte UI requise si contrat respecté

---

## 2. Architecture du Projet

### 2.1 Structure des Dossiers

```
lisanga-frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── common/          # Composants globaux (Button, Input, Navbar, etc.)
│   │   ├── home/            # Composants de la page d'accueil
│   │   ├── comment/         # Composants des commentaires
│   │   └── like/           # Composants des votes
│   ├── context/             # Contextes React (Auth, Theme)
│   ├── hooks/               # Hooks personnalisés
│   ├── pages/               # Pages de l'application
│   ├── services/            # Services API & mocks
│   ├── styles/              # CSS global, variables, thèmes
│   └── utils/               # Utilitaires, validators, formatters
├── public/                  # Assets statiques
├── index.html               # Point d'entrée HTML
├── package.json
├── vite.config.js
└── README.md
```

### 2.2 Fichiers Principaux

#### Contextes (`src/context/`)

| Fichier | Description |
|---------|-------------|
| `AuthContext.jsx` | Gestion de l'authentification (login, logout, user, token) |
| `ThemeContext.jsx` | Gestion du thème clair/sombre |

#### Hooks Personnalisés (`src/hooks/`)

| Fichier | Description |
|---------|-------------|
| `useAuth.js` | Hook pour accéder au contexte d'authentification |
| `useTheme.js` | Hook pour accéder au contexte de thème |
| `useDebounce.js` | Hook pour le debounce (recherche) |
| `useToast.js` | Hook pour les notifications toast |

#### Services (`src/services/`)

| Fichier | Description |
|---------|-------------|
| `api.js` | Configuration Axios avec interceptors |
| `authService.js` | Service d'authentification (login, register, logout, getProfile) |
| `articleService.js` | Service des articles (CRUD + like/dislike) |
| `commentService.js` | Service des commentaires (CRUD) |
| `mockData.js` | Données mockées pour le développement |

#### Utils (`src/utils/`)

| Fichier | Description |
|---------|-------------|
| `constants.js` | Constantes (catégories, options de tri, règles de validation, etc.) |
| `formatters.js` | Fonctions de formatage (dates, nombres, texte) |
| `validators.js` | Fonctions de validation (email, password, article, commentaire) |

---

## 3. Design System

### 3.1 Variables CSS

Les variables CSS sont définies dans `src/styles/variables.css` et incluent :

#### Couleurs

```css
/* Mode Clair */
--color-bg-primary: #ffffff
--color-bg-secondary: #f8fafc
--color-bg-tertiary: #f1f5f9
--color-text-primary: #0f172a
--color-text-secondary: #475569
--color-text-tertiary: #94a3b8
--color-border: #e2e8f0
--color-primary: #2563eb
--color-primary-hover: #1d4ed8
--color-primary-light: #eff6ff
--color-error: #dc2626
--color-error-light: #fef2f2
--color-success: #16a34a
--color-success-light: #f0fdf4
```

#### Typographie

```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem    /* 14px */
--font-size-base: 1rem      /* 16px */
--font-size-lg: 1.125rem    /* 18px */
--font-size-xl: 1.25rem     /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.875rem  /* 30px */
```

#### Espacements

```css
--space-xs: 0.25rem   /* 4px */
--space-sm: 0.5rem    /* 8px */
--space-md: 1rem      /* 16px */
--space-lg: 1.5rem    /* 24px */
--space-xl: 2rem      /* 32px */
--space-2xl: 3rem     /* 48px */
--space-3xl: 4rem     /* 64px */
--space-4xl: 6rem     /* 96px */
```

#### Bordures & Ombres

```css
--radius-sm: 0.25rem
--radius-md: 0.5rem
--radius-lg: 0.75rem
--radius-full: 9999px

--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 10px 15px rgba(0, 0, 0, 0.1)
```

---

## 4. Composants

### 4.1 Composants Communs (`src/components/common/`)

| Composant | Fichiers | Description |
|----------|----------|-------------|
| **Button** | `Button.jsx`, `Button.css` | Bouton avec variantes (primary, outline, danger) et tailles (sm, md, lg) |
| **Input** | `Input.jsx`, `Input.css` | Champ de saisie avec label, erreur, toggle password |
| **ErrorMessage** | `ErrorMessage.jsx`, `ErrorMessage.css` | Affichage des erreurs avec bouton retry |
| **Loader** | `Loader.jsx`, `Loader.css` | Spinner de chargement |
| **Toast** | `Toast.jsx`, `Toast.css` | Notifications temporaires |
| **Navbar** | `Navbar.jsx`, `Navbar.css` | Barre de navigation avec menu, profil, déconnexion |
| **Footer** | `Footer.jsx`, `Footer.css` | Pied de page |
| **ProtectedRoute** | `ProtectedRoute.jsx` | Wrapper pour routes protégées |

### 4.2 Composants Home (`src/components/home/`)

| Composant | Fichiers | Description |
|----------|----------|-------------|
| **Hero** | `Hero.jsx`, `Hero.css` | Section héro de la page d'accueil |
| **ArticleCard** | `ArticleCard.jsx`, `ArticleCard.css` | Carte d'article pour les listes |
| **CategoryFilter** | `CategoryFilter.jsx`, `CategoryFilter.css` | Filtres par catégorie |
| **CTASection** | `CTASection.jsx`, `CTASection.css` | Section call-to-action |

### 4.3 Composants Commentaires (`src/components/comment/`)

| Composant | Fichiers | Description |
|----------|----------|-------------|
| **CommentList** | `CommentList.jsx`, `CommentList.css` | Liste des commentaires avec réponses |
| **CommentForm** | `CommentForm.jsx`, `CommentForm.css` | Formulaire d'ajout de commentaire |

### 4.4 Composants Like (`src/components/like/`)

| Composant | Fichiers | Description |
|----------|----------|-------------|
| **LikeDislike** | `LikeDislike.jsx`, `LikeDislike.css` | Boutons de vote like/dislike |

---

## 5. Pages

### 5.1 Pages Implémentées

| Page | Route | Fichiers | Description |
|------|-------|----------|-------------|
| **Home** | `/` | `Home.jsx`, `Home.css` | Page d'accueil avec Hero, filtres, liste d'articles |
| **Articles** | `/articles` | `Articles.jsx`, `Articles.css` | Liste complète des articles |
| **ArticleDetail** | `/articles/:id` | `ArticleDetail.jsx`, `ArticleDetail.css` | Détail d'un article + commentaires + like/dislike |
| **CreateArticle** | `/creer-article` | `CreateArticle.jsx`, `CreateArticle.css` | Formulaire de création d'article (protégée) |
| **EditArticle** | `/articles/:id/edit` | `EditArticle.jsx`, `EditArticle.css` | Formulaire de modification d'article (protégée) |
| **Login** | `/connexion` | `Login.jsx`, `Login.css` | Formulaire de connexion |
| **Register** | `/inscription` | `Register.jsx`, `Register.css` | Formulaire d'inscription |

### 5.2 Routes Protégées

Les routes suivantes nécessitent une authentification :
- `/creer-article` - Création d'article
- `/articles/:id/edit` - Modification d'article

### 5.3 Route Admin

- `/admin` - Dashboard administrateur (à implémenter)

---

## 6. Services API

### 6.1 Auth Service (`authService.js`)

```javascript
authService.login(email, password)
authService.register(username, email, password)
authService.logout()
authService.refresh()
authService.getProfile()
```

### 6.2 Article Service (`articleService.js`)

```javascript
articleService.getArticles({ category, search, sort, page, limit })
articleService.getArticleById(id)
articleService.createArticle(formData)
articleService.updateArticle(id, formData)
articleService.deleteArticle(id)
articleService.likeArticle(id)
articleService.dislikeArticle(id)
articleService.getUserVote(articleId)
```

### 6.3 Comment Service (`commentService.js`)

```javascript
commentService.getCommentsByArticle(articleId)
commentService.addComment(articleId, content, parentId)
commentService.deleteComment(commentId)
```

---

## 7. Fonctionnalités Détaillées

### 7.1 Authentification

#### Login
- Formulaire email/password avec validation
- Toggle mot de passe visible/masqué
- Gestion des états : loading, error, success
- Redirection intelligente via sessionStorage

#### Register
- Formulaire username/email/password/confirmPassword
- Validation complète (blur + submit)
- Liens Conditions et Politique de confidentialité

#### Persistance
- JWT avec access token (15 min) + refresh token (7 jours)
- Stockage localStorage pour accessToken
- Restauration automatique de session au rechargement
- checkAuth() appelle getProfile() au démarrage

#### ProtectedRoute
- Vérifie isAuthenticated depuis AuthContext
- Affiche Loader pendant le chargement
- Redirige vers /connexion si non connecté

### 7.2 Articles

#### Création
- Titre (10-200 caractères)
- Contenu (100-10000 caractères)
- Catégorie (8 options)
- Image de couverture (max 5 Mo, JPG/PNG/WebP)
- Prévisualisation de l'image
- Validation côté client

#### Liste
- Grille responsive (1/2/3 colonnes)
- Filtres par catégorie
- Recherche textuelle (debounced 300ms)
- Tri (récent, populaire, commenté)
- Pagination

#### Détail
- Affichage complet de l'article
- Actions (modifier/supprimer) si auteur ou admin
- Système de commentaires
- Système de like/dislike

#### Modification
- Pré-remplissage des champs existants
- Mêmes validations que la création

### 7.3 Commentaires

#### Structure à 2 Niveaux
- Commentaires principaux
- Réponses aux commentaires (1 niveau)

#### Formulaire
- Validation (1-1000 caractères)
- États : loading, error
- Support des réponses

#### Actions
- Ajout de commentaire/réponse
- Suppression (auteur ou admin)

### 7.4 Like/Dislike

#### Système Binaire
- Like OU Dislike (pas les deux)
- 1 seul vote par article par utilisateur
- Vote modifiable (cliquer à nouveau pour retirer)

#### Persistance
- localStorage en mode mock
- Prêt pour backend réel

### 7.5 Mode Clair/Sombre

- Toggle dans la navbar
- Persistance du choix en localStorage
- Transition fluide entre thèmes
- Variables CSS dédiées

---

## 8. Catégories d'Articles

| ID | Label | Value |
|----|-------|-------|
| all | Tous | (vide) |
| technologie | Technologie | Technologie |
| business | Business | Business |
| design | Design | Design |
| communauté | Communauté | Communauté |
| formation | Formation | Formation |
| événement | Événement | Événement |
| culture | Culture | Culture |
| societe | Société | Société |

---

## 9. Règles de Validation

### 9.1 Utilisateur

```javascript
username: 3-20 caractères, pattern [a-zA-Z0-9_]
email: format email valide
password: 8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial
```

### 9.2 Article

```javascript
titre: 10-200 caractères
contenu: 100-10000 caractères
image: max 5 Mo, formats JPG/PNG/WebP
```

### 9.3 Commentaire

```javascript
contenu: 1-1000 caractères
```

---

## 10. États des Modules

| Module | Status | Tâches |
|--------|--------|--------|
| Authentification | ✅ Terminé | 6/6 |
| Article | ✅ Terminé | 4/4 |
| Commentaire | ✅ Terminé | 2/2 |
| Like/Dislike | ✅ Terminé | 1/1 |
| Recherche/Filtres | ✅ Terminé | 3/3 |
| Admin Dashboard | ⏳ En attente | 4/4 |
| Profil Utilisateur | ✅ Terminé | 3/3 |

---

## 11. Configuration

### 11.1 Variables d'Environnement

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK=true
```

### 11.2 Changement vers API Réelle

1. Mettre `VITE_USE_MOCK=false`
2. Mettre à jour `VITE_API_BASE_URL`
3. Rebuild : `npm run build`

Aucun fichier code à modifier.

---

## 12. Bonnes Pratiques

### 12.1 Sécurité

- Validation côté client ET serveur
- Tokens en localStorage (access) + HttpOnly cookie (refresh)
- Routes protégées côté frontend ET backend
- Échappement du contenu utilisateur

### 12.2 Performance

- Lazy loading des images
- Debounce sur la recherche (300ms)
- Pagination des listes
- Optimisation des imports

### 12.3 Accessibilité

- Attributs ARIA
- Labels pour les inputs
- Contraste des couleurs
- Focus visible
- Alt text pour les images

---

## 13. Équipe

- **Développé par** : NuruTech
- **Version** : 1.0
- **Date** : Avril 2026

---

## 14. Licence

Propriétaire - NuruTech

---

## 15. Annexe : Arborescence Complète des Fichiers

```
lisanga-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.css
│   │   │   ├── Button.jsx
│   │   │   ├── ErrorMessage.css
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Footer.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Input.css
│   │   │   ├── Input.jsx
│   │   │   ├── Loader.css
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Toast.css
│   │   │   └── Toast.jsx
│   │   ├── home/
│   │   │   ├── ArticleCard.css
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── CategoryFilter.css
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── CTASection.css
│   │   │   ├── CTASection.jsx
│   │   │   ├── Hero.css
│   │   │   └── Hero.jsx
│   │   ├── comment/
│   │   │   ├── CommentForm.css
│   │   │   ├── CommentForm.jsx
│   │   │   ├── CommentList.css
│   │   │   └── CommentList.jsx
│   │   └── like/
│   │       ├── LikeDislike.css
│   │       └── LikeDislike.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   ├── useTheme.js
│   │   └── useToast.js
│   ├── pages/
│   │   ├── Home.css
│   │   ├── Home.jsx
│   │   ├── Login.css
│   │   ├── Login.jsx
│   │   ├── Register.css
│   │   ├── Register.jsx
│   │   ├── Articles.css
│   │   ├── Articles.jsx
│   │   ├── ArticleDetail.css
│   │   ├── ArticleDetail.jsx
│   │   ├── CreateArticle.css
│   │   ├── CreateArticle.jsx
│   │   ├── EditArticle.css
│   │   └── EditArticle.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── articleService.js
│   │   ├── authService.js
│   │   ├── commentService.js
│   │   └── mockData.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── reset.css
│   │   ├── themes.css
│   │   └── variables.css
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.css
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 16. Contacts & Support

Pour toute question ou support, contactez l'équipe NuruTech.

---

## 17. Guides d'Intégration

| Guide | Description |
|-------|-------------|
| **[backend.md](./backend.md)** | Guide complet pour implémenter l'API backend réelle |
| **[tache.md](./tache.md)** | Guide détaillé pour réaliser les tâches restantes |

---

*Dernière mise à jour : Avril 2026*
