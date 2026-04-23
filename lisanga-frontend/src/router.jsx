import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import Profile from './pages/Profile';
import ProtectedRoute from './components/common/ProtectedRoute';

function AppRouter() {
  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route
            path="/creer-article"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/:id/edit"
            element={
              <ProtectedRoute>
                <EditArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Dashboard Admin (à implémenter)</div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div className="container" style={{paddingTop: '2rem'}}>Page non trouvée</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default AppRouter;
