import { useEffect, useMemo, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import { formatDateShort } from '../utils/formatters';
import './Admin.css';

function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <section className="admin">
        <div className="container">
          <h1 className="admin__title">Dashboard Admin</h1>
          <p className="admin__subtitle">
            Pilotez les statistiques, la moderation, les utilisateurs et les categories.
          </p>

          <div className="admin__tabs">
            <TabButton tab="overview" activeTab={activeTab} onClick={setActiveTab}>
              Apercu
            </TabButton>
            <TabButton tab="articles" activeTab={activeTab} onClick={setActiveTab}>
              Articles
            </TabButton>
            <TabButton tab="users" activeTab={activeTab} onClick={setActiveTab}>
              Utilisateurs
            </TabButton>
            <TabButton tab="categories" activeTab={activeTab} onClick={setActiveTab}>
              Categories
            </TabButton>
          </div>

          <div className="admin__content">
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'articles' && <AdminArticles />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'categories' && <AdminCategories />}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function TabButton({ tab, activeTab, onClick, children }) {
  return (
    <button
      type="button"
      className={`admin__tab ${activeTab === tab ? 'active' : ''}`}
      onClick={() => onClick(tab)}
    >
      {children}
    </button>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.stats);
      } catch (error) {
        console.error('Erreur de chargement des statistiques :', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!stats) {
    return <p>Impossible de charger les statistiques.</p>;
  }

  return (
    <div className="admin-overview">
      <div className="admin-overview__cards">
        <StatCard label="Utilisateurs" value={stats.totalUsers} />
        <StatCard label="Articles" value={stats.totalArticles} />
        <StatCard label="Commentaires" value={stats.totalComments} />
        <StatCard label="Likes" value={stats.totalLikes} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="admin-stat-card">
      <p className="admin-stat-card__value">{value}</p>
      <p className="admin-stat-card__label">{label}</p>
    </article>
  );
}

function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadArticles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getAllArticles({ page });
      setArticles(response.articles);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Erreur de chargement des articles :', error);
      setFeedback('Impossible de charger les articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (articleId) => {
    const confirmed = window.confirm('Supprimer cet article ?');
    if (!confirmed) {
      return;
    }

    try {
      await adminService.deleteArticle(articleId);
      setArticles((prev) => prev.filter((article) => article.id !== articleId));
      setFeedback('Article supprime avec succes.');
    } catch (error) {
      console.error('Erreur de suppression :', error);
      setFeedback('Suppression impossible pour le moment.');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-panel">
      {feedback && <p className="admin-message">{feedback}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Auteur</th>
              <th>Categorie</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.author?.username || 'Inconnu'}</td>
                <td>{article.category}</td>
                <td>{formatDateShort(article.createdAt)}</td>
                <td>
                  <div className="admin-actions">
                    <Link
                      className="admin-link"
                      to={`/articles/${article.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voir
                    </Link>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() => handleDelete(article.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onChange={loadArticles}
        />
      )}
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({ page });
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Erreur de chargement des utilisateurs :', error);
      setFeedback('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleBan = async (targetUser) => {
    if (targetUser.role === 'admin') {
      return;
    }

    const action = targetUser.isActive ? 'bannir' : 'debannir';
    const confirmed = window.confirm(`Voulez-vous ${action} ${targetUser.username} ?`);
    if (!confirmed) {
      return;
    }

    try {
      if (targetUser.isActive) {
        await adminService.banUser(targetUser.id);
      } else {
        await adminService.unbanUser(targetUser.id);
      }

      setUsers((prev) =>
        prev.map((item) =>
          item.id === targetUser.id ? { ...item, isActive: !targetUser.isActive } : item
        )
      );
      setFeedback(`Utilisateur ${action} avec succes.`);
    } catch (error) {
      console.error('Erreur utilisateur :', error);
      setFeedback(`Action impossible pour ${targetUser.username}.`);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-panel">
      {feedback && <p className="admin-message">{feedback}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Role</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((account) => (
              <tr key={account.id}>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.role}</td>
                <td>{account.isActive ? 'Actif' : 'Banni'}</td>
                <td>
                  {account.role === 'admin' ? (
                    <span className="admin-note">Non modifiable</span>
                  ) : (
                    <button
                      type="button"
                      className={`admin-btn ${account.isActive ? 'admin-btn--warning' : 'admin-btn--success'}`}
                      onClick={() => toggleBan(account)}
                    >
                      {account.isActive ? 'Bannir' : 'Debannir'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onChange={loadUsers}
        />
      )}
    </div>
  );
}

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');

  const isFormValid = useMemo(() => name.trim().length >= 2, [name]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Erreur de chargement des categories :', error);
      setFeedback('Impossible de charger les categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (event) => {
    event.preventDefault();
    if (!isFormValid) {
      return;
    }

    try {
      const response = await adminService.addCategory({
        name: name.trim(),
        description: description.trim()
      });
      setCategories((prev) => [...prev, response.category]);
      setName('');
      setDescription('');
      setFeedback('Categorie ajoutee avec succes.');
    } catch (error) {
      console.error('Erreur ajout categorie :', error);
      setFeedback('Ajout de categorie impossible.');
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(`Supprimer la categorie "${category.name}" ?`);
    if (!confirmed) {
      return;
    }

    try {
      await adminService.deleteCategory(category.id);
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      setFeedback('Categorie supprimee avec succes.');
    } catch (error) {
      console.error('Erreur suppression categorie :', error);
      setFeedback('Suppression impossible.');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-panel">
      <p className="admin-note">
        Les categories disponibles pour la publication d&apos;articles sont predefinies ici par
        l&apos;administrateur.
      </p>
      {feedback && <p className="admin-message">{feedback}</p>}

      <form className="admin-category-form" onSubmit={handleAddCategory}>
        <input
          type="text"
          className="admin-input"
          placeholder="Nom de categorie (ex: Technologie)"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          className="admin-input"
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit" className="admin-btn admin-btn--primary" disabled={!isFormValid}>
          Ajouter
        </button>
      </form>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.description || '-'}</td>
                <td>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onChange }) {
  return (
    <div className="admin-pagination">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={`admin-page-btn ${pageNumber === currentPage ? 'active' : ''}`}
          onClick={() => onChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
}

export default Admin;
