# GUIDE DES TÂCHES RESTANTES - LISANGA FRONTEND

## Vue d'Ensemble

Il reste **7 tâches** à implémenter, organisées en 2 modules :

| Module | Tâches | Description |
|--------|--------|-------------|
| **Admin Dashboard** | 17-20 | Dashboard admin avec stats et modération |
| **Profil Utilisateur** | 21-23 | Page profil et historique |

---

## Module Recherche/Filtres (Tâches 14-16) - ✅ Terminée

### Note Importante

Les améliorations attendues ont été implémentées dans le module Recherche/Filtres :
- `Home.jsx` et `Articles.jsx` supportent maintenant catégorie + recherche + tri combinés
- Le tri préféré est conservé en localStorage
- La barre de recherche affiche des suggestions et enregistre l'historique
- Les filtres par catégorie affichent le nombre d'articles par catégorie

---

### ✅ Tâche 14 : Améliorer les Filtres par Catégorie

**Situation actuelle :**
- `CategoryFilter.jsx` affiche les catégories disponibles
- La sélection met à jour `activeCategory` dans le composant parent

**Améliorations possibles :**

1. **Filtre combiné** - Permettre de combiner catégorie + recherche + tri
2. **Compteur en temps réel** - Afficher le nombre d'articles par catégorie
3. **Catégories populaires** - Mettre en évidence les catégories avec le plus d'articles

**Fichiers à modifier :**
- `src/components/home/CategoryFilter.jsx`
- `src/components/home/CategoryFilter.css`

**Code à ajouter :**

```jsx
// Exemple : Compteur par catégorie dans CategoryFilter.jsx
function CategoryFilter({ activeCategory, onCategoryChange, categoryCounts }) {
  return (
    <div className="category-filter">
      <div className="category-filter__pills-wrapper">
        {CATEGORIES.map(category => {
          const count = categoryCounts?.[category.value] || 0;
          const isActive = activeCategory === category.value;
          return (
            <button
              key={category.id}
              className={`category-filter__pill ${isActive ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
              {count > 0 && (
                <span className="category-filter__count">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

### ✅ Tâche 15 : Options de Tri Améliorées

**Situation actuelle :**
- Le tri est implémenté dans `articleService.js` (mode mock)
- Options : `recent`, `popular`, `commented`

**Améliorations possibles :**

1. **Tri personnalisé** - Permettre aux utilisateurs de définir leur propre tri
2. **Sauvegarde des préférences** - Stocker le tri préféré en localStorage
3. **Indicateur visuel** - Montrer clairement quel tri est actif

**Code à ajouter dans Articles.jsx :**

```jsx
// Sauvegarde du tri préféré
const [sortBy, setSortBy] = useState(() => {
  return localStorage.getItem('lisanga_sort_preference') || 'recent';
});

const handleSortChange = (e) => {
  const value = e.target.value;
  setSortBy(value);
  localStorage.setItem('lisanga_sort_preference', value);
  setCurrentPage(1);
};
```

---

### ✅ Tâche 16 : Barre de Recherche Améliorée

**Situation actuelle :**
- Recherche implémentée avec `useDebounce` (300ms)
- Recherche dans titre ET contenu

**Améliorations possibles :**

1. **Suggestions de recherche** - Autocomplétion basée sur les titres
2. **Historique de recherche** - Sauvegarder les dernières recherches
3. **Recherche avancée** - Filtrer par auteur, date, catégorie

**Code pour l'historique de recherche :**

```jsx
// Dans Articles.jsx ou Home.jsx
const [searchHistory, setSearchHistory] = useState(() => {
  const saved = localStorage.getItem('lisanga_search_history');
  return saved ? JSON.parse(saved) : [];
});

const handleSearch = (query) => {
  if (query && !searchHistory.includes(query)) {
    const newHistory = [query, ...searchHistory].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('lisanga_search_history', JSON.stringify(newHistory));
  }
};
```

---

## Module Profil Utilisateur (Tâches 21-23) - ✅ Terminée

### Note Importante

Le module Profil Utilisateur a été entièrement implémenté :
- `Profile.jsx` : Page profil avec onglets (Informations, Mes Articles, Mes Commentaires)
- `Profile.css` : Styles responsives pour la page profil
- `userService.js` : Service API pour les opérations utilisateur
- Route `/profil` ajoutée dans `router.jsx`
- Lien profil déjà présent dans `Navbar.jsx`

### Fonctionnalités Implémentées

**Tâche 21 : Page Profil (`/profil`)**
- ✅ Création de `Profile.jsx` et `Profile.css`
- ✅ Route protégée ajoutée dans `router.jsx`
- ✅ Structure avec onglets et avatar utilisateur

**Tâche 22 : Modification Informations Utilisateur**
- ✅ Composant `ProfileInfo` avec mode édition/affichage
- ✅ Formulaire de modification du profil (username, email, avatar)
- ✅ Gestion des états de chargement et messages de succès/erreur

**Tâche 23 : Historique des Articles/Commentaires**
- ✅ `userService.js` créé avec méthodes `getUserArticles`, `getUserComments`, `updateProfile`
- ✅ Composant `ProfileArticles` affichant les articles de l'utilisateur
- ✅ Composant `ProfileComments` affichant les commentaires de l'utilisateur
- ✅ Support mock et API réelle

---

## Module Admin Dashboard (Tâches 17-20)

### Vue d'Ensemble

Le dashboard admin nécessite :
- Une page `/admin` protégée (réservée aux admins)
- Un service admin pour les statistiques
- Une interface de modération des articles
- Une gestion des utilisateurs (bannissement)
- Une gestion des categories predefinies (creation/suppression)

---

### Tâche 17 : Page Dashboard Admin (`/admin`)

**Fichier à créer :**
- `src/pages/Admin.jsx`
- `src/pages/Admin.css`

**Structure de la page :**

```jsx
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import './Admin.css';

function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Vérification admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      return;
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="admin">
        <div className="container">
          <h1 className="admin__title">Dashboard Admin</h1>
          
          <div className="admin__tabs">
            <button
              className={`admin__tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Aperçu
            </button>
            <button
              className={`admin__tab ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              Articles
            </button>
            <button
              className={`admin__tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Utilisateurs
            </button>
          </div>

          <div className="admin__content">
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'articles' && <AdminArticles />}
            {activeTab === 'users' && <AdminUsers />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Admin;
```

**CSS de base :**

```css
.admin {
  padding: var(--space-3xl) 0;
  min-height: calc(100vh - var(--navbar-height));
}

.admin__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2xl);
}

.admin__tabs {
  display: flex;
  gap: var(--space-xs);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-2xl);
}

.admin__tab {
  padding: var(--space-sm) var(--space-lg);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}

.admin__tab:hover {
  color: var(--color-primary);
}

.admin__tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
```

---

### Tâche 18 : Statistiques et Métriques

**Service à créer :**
- `src/services/adminService.js`

```javascript
// src/services/adminService.js
import { api, isMockMode } from './api';
import { delay, mockUsers, mockArticles } from './mockData';

export const adminService = {
  getStats: async () => {
    if (isMockMode()) {
      await delay();
      
      return {
        stats: {
          totalUsers: mockUsers.length,
          totalArticles: mockArticles.length,
          totalComments: 45, // À calculer depuis mockComments
          totalLikes: mockArticles.reduce((sum, a) => sum + a.likesCount, 0),
          activeUsers: mockUsers.filter(u => u.isActive).length,
          recentArticles: mockArticles.slice(0, 5)
        }
      };
    }
    
    return api.get('/admin/stats');
  },
  
  getAllUsers: async ({ page = 1, limit = 20 } = {}) => {
    if (isMockMode()) {
      await delay();
      
      const startIndex = (page - 1) * limit;
      const paginatedUsers = mockUsers.slice(startIndex, startIndex + limit);
      
      return {
        users: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(mockUsers.length / limit),
          totalUsers: mockUsers.length
        }
      };
    }
    
    return api.get(`/admin/users?page=${page}&limit=${limit}`);
  },
  
  getAllArticles: async ({ page = 1, limit = 20 } = {}) => {
    if (isMockMode()) {
      await delay();
      
      const startIndex = (page - 1) * limit;
      const paginatedArticles = mockArticles.slice(startIndex, startIndex + limit);
      
      return {
        articles: paginatedArticles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(mockArticles.length / limit),
          totalArticles: mockArticles.length
        }
      };
    }
    
    return api.get(`/admin/articles?page=${page}&limit=${limit}`);
  },
  
  banUser: async (userId) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Utilisateur banni avec succès' };
    }
    
    return api.post(`/admin/users/${userId}/ban`);
  },
  
  unbanUser: async (userId) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Utilisateur débanni avec succès' };
    }
    
    return api.post(`/admin/users/${userId}/unban`);
  },
  
  deleteArticle: async (articleId) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Article supprimé avec succès' };
    }
    
    return api.delete(`/admin/articles/${articleId}`);
  }
};
```

**Composant AdminOverview :**

```jsx
function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.stats);
      } catch (err) {
        console.error('Erreur chargement stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="admin-overview">
      <div className="admin-overview__cards">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="admin-stat-card__content">
            <span className="admin-stat-card__value">{stats.totalUsers}</span>
            <span className="admin-stat-card__label">Utilisateurs</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="admin-stat-card__content">
            <span className="admin-stat-card__value">{stats.totalArticles}</span>
            <span className="admin-stat-card__label">Articles</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="admin-stat-card__content">
            <span className="admin-stat-card__value">{stats.totalComments}</span>
            <span className="admin-stat-card__label">Commentaires</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="admin-stat-card__content">
            <span className="admin-stat-card__value">{stats.totalLikes}</span>
            <span className="admin-stat-card__label">Likes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### Tâche 19 : Gestion des Articles (Modération)

**Composant AdminArticles :**

```jsx
function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getAllArticles({ page });
      setArticles(response.articles);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Supprimer cet article ?')) {
      try {
        await adminService.deleteArticle(articleId);
        setArticles(prev => prev.filter(a => a.id !== articleId));
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-articles">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Catégorie</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td>
                <a href={`/articles/${article.id}`} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </td>
              <td>{article.author?.username}</td>
              <td>{article.category}</td>
              <td>{formatDateShort(article.createdAt)}</td>
              <td>
                <button
                  className="admin-btn admin-btn--danger"
                  onClick={() => handleDelete(article.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div className="admin-pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={page === pagination.currentPage ? 'active' : ''}
              onClick={() => loadArticles(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Tâche 20 : Gestion des Utilisateurs (Bannissement)

**Composant AdminUsers :**

```jsx
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({ page });
      setUsers(response.users);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId) => {
    if (window.confirm('Bannir cet utilisateur ?')) {
      try {
        await adminService.banUser(userId);
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isActive: false } : u
        ));
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  const handleUnban = async (userId) => {
    try {
      await adminService.unbanUser(userId);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isActive: true } : u
      ));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-users">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={!user.isActive ? 'banned' : ''}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge role-badge--${user.role}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <span className={`status-badge ${user.isActive ? 'active' : 'banned'}`}>
                  {user.isActive ? 'Actif' : 'Banni'}
                </span>
              </td>
              <td>
                {user.role !== 'admin' && (
                  user.isActive ? (
                    <button
                      className="admin-btn admin-btn--warning"
                      onClick={() => handleBan(user.id)}
                    >
                      Bannir
                    </button>
                  ) : (
                    <button
                      className="admin-btn admin-btn--success"
                      onClick={() => handleUnban(user.id)}
                    >
                      Débannir
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**CSS additionnel pour Admin :**

```css
/* Admin Cards */
.admin-overview__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.admin-stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.admin-stat-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-md);
}

.admin-stat-card__content {
  display: flex;
  flex-direction: column;
}

.admin-stat-card__value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.admin-stat-card__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Admin Table */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.admin-table th,
.admin-table td {
  padding: var(--space-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.admin-table th {
  background: var(--color-bg-secondary);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.admin-table tr.banned {
  opacity: 0.6;
}

/* Admin Buttons */
.admin-btn {
  padding: var(--space-xs) var(--space-sm);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.admin-btn--danger {
  background: var(--color-error-light);
  color: var(--color-error);
}

.admin-btn--warning {
  background: #fef3c7;
  color: #d97706;
}

.admin-btn--success {
  background: var(--color-success-light);
  color: var(--color-success);
}

/* Role & Status Badges */
.role-badge,
.status-badge {
  display: inline-block;
  padding: 2px var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.role-badge--admin {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.role-badge--user {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.status-badge.active {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-badge.banned {
  background: var(--color-error-light);
  color: var(--color-error);
}
```

---

## Module Profil Utilisateur (Tâches 21-23)

### Tâche 21 : Page Profil (`/profil`)

**Fichier à créer :**
- `src/pages/Profile.jsx`
- `src/pages/Profile.css`

**Route à ajouter dans router.jsx :**

```jsx
<Route
  path="/profil"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

**Structure du Profile :**

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <section className="profile">
        <div className="container">
          <div className="profile__header">
            <div className="profile__avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} />
              ) : (
                <div className="profile__avatar-initials">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile__info">
              <h1 className="profile__name">{user.username}</h1>
              <p className="profile__email">{user.email}</p>
              <span className="profile__role">{user.role}</span>
            </div>
          </div>

          <div className="profile__tabs">
            <button
              className={`profile__tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Informations
            </button>
            <button
              className={`profile__tab ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              Mes Articles
            </button>
            <button
              className={`profile__tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Mes Commentaires
            </button>
          </div>

          <div className="profile__content">
            {activeTab === 'info' && <ProfileInfo user={user} />}
            {activeTab === 'articles' && <ProfileArticles userId={user.id} />}
            {activeTab === 'comments' && <ProfileComments userId={user.id} />}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Profile;
```

---

### Tâche 22 : Modification Informations Utilisateur

**Composant ProfileInfo :**

```jsx
function ProfileInfo({ user }) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Appeler API pour mettre à jour
    try {
      // await userService.updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-info">
      {isEditing ? (
        <form className="profile-info__form" onSubmit={handleSubmit}>
          <Input
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="URL de l'avatar"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
          <div className="profile-info__actions">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? <Loader size="sm" /> : 'Enregistrer'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="profile-info__display">
          <div className="profile-info__field">
            <span className="profile-info__label">Nom d'utilisateur</span>
            <span className="profile-info__value">{formData.username}</span>
          </div>
          <div className="profile-info__field">
            <span className="profile-info__label">Email</span>
            <span className="profile-info__value">{formData.email}</span>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Modifier le profil
          </Button>
        </div>
      )}
    </div>
  );
}
```

---

### Tâche 23 : Historique des Articles/Commentaires

**Service à ajouter dans userService.js :**

```javascript
// src/services/userService.js (à créer)
import { api, isMockMode } from './api';
import { delay, mockArticles, mockComments } from './mockData';

export const userService = {
  getUserArticles: async (userId) => {
    if (isMockMode()) {
      await delay();
      const userArticles = mockArticles.filter(a => a.author?.id === userId);
      return { articles: userArticles };
    }
    return api.get(`/users/${userId}/articles`);
  },
  
  getUserComments: async (userId) => {
    if (isMockMode()) {
      await delay();
      const userComments = mockComments.filter(c => c.author?.id === userId);
      return { comments: userComments };
    }
    return api.get(`/users/${userId}/comments`);
  },
  
  updateProfile: async (data) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Profil mis à jour', user: data };
    }
    return api.put('/users/profile', data);
  }
};
```

**Composant ProfileArticles :**

```jsx
function ProfileArticles({ userId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await userService.getUserArticles(userId);
        setArticles(response.articles);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [userId]);

  if (loading) return <Loader />;

  if (articles.length === 0) {
    return (
      <div className="profile-empty">
        <p>Vous n'avez pas encore publié d'articles.</p>
        <Button variant="primary" onClick={() => window.location.href = '/creer-article'}>
          Créer un article
        </Button>
      </div>
    );
  }

  return (
    <div className="profile-articles">
      {articles.map(article => (
        <div key={article.id} className="profile-article-card">
          <h3>
            <a href={`/articles/${article.id}`}>{article.title}</a>
          </h3>
          <div className="profile-article-meta">
            <span>{article.category}</span>
            <span>{formatDate(article.createdAt)}</span>
            <span>{article.likesCount} likes</span>
            <span>{article.commentsCount} commentaires</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Composant ProfileComments :**

```jsx
function ProfileComments({ userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await userService.getUserComments(userId);
        setComments(response.comments);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [userId]);

  if (loading) return <Loader />;

  if (comments.length === 0) {
    return (
      <div className="profile-empty">
        <p>Vous n'avez pas encore de commentaires.</p>
      </div>
    );
  }

  return (
    <div className="profile-comments">
      {comments.map(comment => (
        <div key={comment.id} className="profile-comment-card">
          <p className="profile-comment-content">{comment.content}</p>
          <div className="profile-comment-meta">
            <a href={`/articles/${comment.articleId}`}>
              Voir l'article
            </a>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Résumé des Fichiers à Créer

| Module | Fichier | Description |
|--------|---------|-------------|
| Admin | `Admin.jsx` | Page dashboard admin |
| Admin | `Admin.css` | Styles dashboard admin |
| Admin | `adminService.js` | Service API admin |
| User | `Profile.jsx` | Page profil utilisateur |
| User | `Profile.css` | Styles profil |
| User | `userService.js` | Service API utilisateur |

## Résumé des Fichiers à Modifier

| Fichier | Modification |
|---------|--------------|
| `router.jsx` | Ajouter routes /admin et /profil |
| `Navbar.jsx` | Ajouter lien vers /admin pour admins |

---

## Checklist Avant de Commencer

- [ ] Lire attentivement ce guide
- [ ] Vérifier les services mock existants
- [ ] Préparer les routes API (si backend prêt)
- [ ] Créer les fichiers dans l'ordre : Services → Composants → Pages
- [ ] Tester chaque fonctionnalité après implémentation

---

*Dernière mise à jour : Avril 2026*
