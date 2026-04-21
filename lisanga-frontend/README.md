# LISANGA - Plateforme Communautaire

Plateforme moderne de publication et débat, développée par **NuruTech**.

##  Stack Technique

- **Frontend** : React 18+ / Vite / CSS Pur / React Router v6+
- **State Management** : Context API
- **Styling** : CSS Variables + Design System
- **Mode** : Clair/Sombre sans rechargement

##  Installation

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

## ️ Structure du Projet

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

##  Design System

Le projet utilise un design system strict avec :
- Variables CSS pour couleurs, espacements, typographie
- Mode clair/sombre automatique
- Composants harmonisés
- Responsive mobile-first

##  Authentification

- JWT avec access token (15 min) + refresh token (7 jours)
- Persistance dans localStorage
- Routes protégées
- Redirection intelligente post-login

##  Progression du Projet

###  Tâches Terminées

**Module Authentification (Login / Register)**
- ✅ Tâche 1 : Page Login (`src/pages/Login.jsx` + `Login.css`)
  - Formulaire email/password avec validation côté client
  - Gestion des états loading/error/success
  - Toggle mot de passe (via Input component)
  - Redirection intelligente via sessionStorage
- ✅ Tâche 2 : Page Register (`src/pages/Register.jsx` + `Register.css`)
  - Formulaire username/email/password/confirmPassword
  - Validation complète (blur + submit)
  - Lien Conditions et Politique de confidentialité
  - Redirection vers Login avec message de succès

### ⏳ Tâches Restantes

**Module Authentification (suite)**
- ✅ Tâche 3 : Améliorer `AuthContext.checkAuth`
  - Appelle `authService.getProfile()` au rechargement pour restaurer `user`
  - Gestion redirection intelligente via `sessionStorage.redirect_url`
  - Nettoyage automatique si token invalide/expiré
- ⏳ Tâche 4 : Créer `ProtectedRoute` (`src/components/common/ProtectedRoute.jsx`)
  - Vérifier `isAuthenticated` depuis AuthContext
  - Afficher Loader pendant loading
  - Rediriger vers /connexion si non connecté
- ⏳ Tâche 5 : Connecter Navbar à AuthContext
  - Afficher avatar + nom + "Déconnexion" si connecté
  - Afficher "Connexion" + "Inscription" si non connecté
  - Dropdown menu pour le profil utilisateur
- ⏳ Tâche 6 : Mettre à jour le Router (`src/router.jsx`)
  - Ajouter routes /connexion et /inscription
  - Préparer routes protégées /admin et /creer-article via ProtectedRoute

### 🔄 Pour Reprendre le Travail

Si vous devez reprendre ce projet après une pause :

1. **Lire cette section** du README pour comprendre où nous en étions
2. **Continuer à la Tâche 3** : améliorer `AuthContext.checkAuth` dans `src/context/AuthContext.jsx`
3. **Ordre recommandé** : Tâche 3 → Tâche 4 → Tâche 5 → Tâche 6
4. **Tester** : Après la Tâche 6, lancer `npm run dev` et vérifier :
   - /connexion → formulaire Login fonctionnel
   - /inscription → formulaire Register fonctionnel
   - Navbar affiche les boutons ou le profil selon l'état d'authentification

###  Fichiers Modifiés/Créés

```
src/pages/
├── Login.jsx      ✅ (nouveau)
├── Login.css      ✅ (nouveau)
├── Register.jsx   ✅ (nouveau)
└── Register.css   ✅ (nouveau)

src/context/
└── AuthContext.jsx   ⏳ (à modifier - Tâche 3)

src/components/common/
└── ProtectedRoute.jsx   ⏳ (nouveau - Tâche 4)
└── Navbar.jsx           ⏳ (à modifier - Tâche 5)

src/router.jsx   ⏳ (à modifier - Tâche 6)
```

---

## 📱 Fonctionnalités

- ✅ Publication d'articles avec upload d'images
- ✅ Système de like/dislike
- ✅ Commentaires à 2 niveaux
- ✅ Filtres et recherche
- ✅ Dashboard admin
- ✅ Mode clair/sombre
- ✅ Responsive design

##  Configuration

Copier `.env.example` vers `.env.local` et ajuster :

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK=true
```

##  Documentation

- **Catégories** : Technologie, Business, Design, Communauté, Formation, Événement, Culture, Société
- **Limites** : 
  - Images : 5 Mo max (JPG/PNG/WebP)
  - Titre article : 10-200 caractères
  - Contenu article : 100-10000 caractères
  - Commentaire : 1-1000 caractères

##  Migration vers API Réelle

Quand le backend sera prêt :

1. Modifier `.env.local` : `VITE_USE_MOCK=false`
2. Mettre à jour `VITE_API_BASE_URL`
3. Rebuild : `npm run build`

Aucun fichier code à modifier, tout est prêt !

##  Équipe

Développé par **NuruTech** - 2026

##  Licence

Propriétaire - NuruTech
