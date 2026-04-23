import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    }
    if (menuOpen || profileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen, profileOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const getInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <a href="/" className="navbar__logo" aria-label="Lisanga - Accueil">
          <span className="navbar__logo-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563EB" />
              <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">L</text>
            </svg>
          </span>
          <span className="navbar__logo-text">Lisanga</span>
        </a>

        {/* Desktop navigation */}
        <nav className="navbar__nav" aria-label="Navigation principale">
          <ul className="navbar__nav-list">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a href={link.href} className="navbar__nav-link">{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Theme toggle */}
          <button
            type="button"
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Auth - Desktop */}
          {isAuthenticated ? (
            <div className="navbar__profile" ref={profileRef}>
              <button
                type="button"
                className="navbar__profile-btn"
                onClick={() => setProfileOpen(prev => !prev)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span className="navbar__avatar">{getInitials(user?.username)}</span>
                <span className="navbar__username">{user?.username}</span>
                <svg className={`navbar__chevron ${profileOpen ? 'navbar__chevron--up' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              
              {profileOpen && (
                <div className="navbar__dropdown" role="menu">
                  <div className="navbar__dropdown-header">
                    <span className="navbar__dropdown-name">{user?.username}</span>
                    <span className="navbar__dropdown-email">{user?.email}</span>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link to="/profil" className="navbar__dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profil
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="navbar__dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2l3 4 5 .8-3.5 3.7.8 5.2L12 14l-5.3 2.7.8-5.2L4 6.8 9 6z" />
                      </svg>
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/connexion" className="navbar__btn navbar__btn--outline">Connexion</Link>
              <Link to="/inscription" className="navbar__btn navbar__btn--solid">Inscription</Link>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            ref={hamburgerRef}
            type="button"
            className="navbar__hamburger"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="navbar__mobile-menu"
          role="dialog"
          aria-label="Menu de navigation mobile"
        >
          <nav aria-label="Navigation mobile">
            <ul className="navbar__mobile-nav-list">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="navbar__mobile-nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Auth - Mobile */}
          {isAuthenticated ? (
            <div className="navbar__mobile-auth">
              <div className="navbar__mobile-profile">
                <span className="navbar__avatar navbar__avatar--lg">{getInitials(user?.username)}</span>
                <div className="navbar__mobile-profile-info">
                  <span className="navbar__mobile-profile-name">{user?.username}</span>
                  <span className="navbar__mobile-profile-email">{user?.email}</span>
                </div>
              </div>
              <div className="navbar__mobile-auth-actions">
                <Link to="/profil" className="navbar__btn navbar__btn--outline navbar__btn--full" onClick={() => setMenuOpen(false)}>
                  Profil
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="navbar__btn navbar__btn--outline navbar__btn--full" onClick={() => setMenuOpen(false)}>
                    Dashboard Admin
                  </Link>
                )}
                <button
                  type="button"
                  className="navbar__btn navbar__btn--outline navbar__btn--full navbar__btn--danger"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="navbar__mobile-auth">
              <Link to="/connexion" className="navbar__btn navbar__btn--outline navbar__btn--full" onClick={() => setMenuOpen(false)}>
                Connexion
              </Link>
              <Link to="/inscription" className="navbar__btn navbar__btn--solid navbar__btn--full" onClick={() => setMenuOpen(false)}>
                Inscription
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;