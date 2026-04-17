import { useState } from 'react';
import './MainNavbar.css';

function MainNavbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // À remplacer par contexte auth plus tard

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <nav className="main-navbar">
      <div className="container">
        <div className="main-navbar__content">
          {/* Logo */}
          <a href="/" className="main-navbar__logo">
            <span className="main-navbar__logo-icon">L</span>
            <span className="main-navbar__logo-text">Lisanga</span>
          </a>

          {/* Menu Desktop */}
          <ul className="main-navbar__menu">
            <li><a href="#" className="main-navbar__link">Accueil</a></li>
            <li><a href="#" className="main-navbar__link">Articles</a></li>
            <li><a href="#" className="main-navbar__link">À propos</a></li>
            <li><a href="#" className="main-navbar__link">Contact</a></li>
          </ul>

          {/* Actions */}
          <div className="main-navbar__actions">
            <button 
              className="icon-btn main-navbar__theme-toggle" 
              onClick={toggleTheme}
              aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              )}
            </button>

            {isLoggedIn ? (
              <div className="main-navbar__profile">
                <img 
                  src="https://ui-avatars.com/api/?name=User&background=2563eb&color=fff" 
                  alt="Profil" 
                  className="main-navbar__avatar"
                />
              </div>
            ) : (
              <div className="main-navbar__auth">
                <a href="#" className="btn btn-ghost">Connexion</a>
                <a href="#" className="btn btn-primary">Inscription</a>
              </div>
            )}

            {/* Menu burger mobile */}
            <button 
              className="icon-btn main-navbar__burger" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12"/>
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="main-navbar__mobile-menu">
            <ul className="main-navbar__mobile-links">
              <li><a href="#" className="main-navbar__link">Accueil</a></li>
              <li><a href="#" className="main-navbar__link">Articles</a></li>
              <li><a href="#" className="main-navbar__link">À propos</a></li>
              <li><a href="#" className="main-navbar__link">Contact</a></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default MainNavbar;