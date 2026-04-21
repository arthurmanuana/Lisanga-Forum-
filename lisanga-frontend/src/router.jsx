import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/common/ProtectedRoute';

function AppRouter() {
  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route
            path="/creer-article"
            element={
              <ProtectedRoute>
                <div>Create Article (à implémenter)</div>
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
