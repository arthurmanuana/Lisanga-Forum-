# LISANGA - Plateforme Communautaire

Plateforme moderne de publication et débat, développée par **NuruTech**.

## 🚀 Stack Technique

- **Frontend** : React 18+ / Vite / CSS Pur / React Router v6+
- **State Management** : Context API
- **Styling** : CSS Variables + Design System
- **Mode** : Clair/Sombre sans rechargement

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
```

## 🏗️ Structure du Projet

```
lisanga-frontend/
├── src/
│   ├── assets/          # Images, icônes
│   ├── components/      # Composants réutilisables
│   ├── context/         # Contextes React (Auth, Theme)
│   ├── hooks/           # Hooks personnalisés
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services API & mocks
│   ├── styles/          # CSS global, variables, thèmes
│   └── utils/           # Utilitaires, validators, formatters
├── public/              # Assets statiques
└── index.html           # Point d'entrée HTML
```

## 🎨 Design System

Le projet utilise un design system strict avec :
- Variables CSS pour couleurs, espacements, typographie
- Mode clair/sombre automatique
- Composants harmonisés
- Responsive mobile-first

## 🔐 Authentification

- JWT avec access token (15 min) + refresh token (7 jours)
- Persistance dans localStorage
- Routes protégées
- Redirection intelligente post-login

## 📱 Fonctionnalités

- ✅ Publication d'articles avec upload d'images
- ✅ Système de like/dislike
- ✅ Commentaires à 2 niveaux
- ✅ Filtres et recherche
- ✅ Dashboard admin
- ✅ Mode clair/sombre
- ✅ Responsive design

## 🔧 Configuration

Copier `.env.example` vers `.env.local` et ajuster :

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK=true
```

## 📚 Documentation

- **Catégories** : Technologie, Business, Design, Communauté, Formation, Événement, Culture, Société
- **Limites** : 
  - Images : 5 Mo max (JPG/PNG/WebP)
  - Titre article : 10-200 caractères
  - Contenu article : 100-10000 caractères
  - Commentaire : 1-1000 caractères

## 🚀 Migration vers API Réelle

Quand le backend sera prêt :

1. Modifier `.env.local` : `VITE_USE_MOCK=false`
2. Mettre à jour `VITE_API_BASE_URL`
3. Rebuild : `npm run build`

Aucun fichier code à modifier, tout est prêt !

## 👥 Équipe

Développé par **NuruTech** - 2026

## 📄 Licence

Propriétaire - NuruTech
