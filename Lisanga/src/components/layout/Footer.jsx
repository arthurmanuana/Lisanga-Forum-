import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        {/* Section CTA (Call to Action) - Style "Carte Sombre" */}
        <div className="footer__cta">
          <div className="footer__cta-content">
            <h2 className="footer__cta-title">Commencez l'aventure avec nous</h2>
            <p className="footer__cta-text">
              Rejoignez une communauté grandissante. Partagez vos idées, lisez des articles inspirants et participez aux débats.
            </p>
            <div className="footer__cta-actions">
              <a href="#" className="btn btn-white">S'inscrire gratuitement</a>
              <a href="#" className="btn btn-outline-white">En savoir plus</a>
            </div>
          </div>
        </div>

        {/* Section Liens - Grille */}
        <div className="footer__grid">
          {/* Colonne 1: Marque */}
          <div className="footer__col">
            <a href="/" className="footer__logo">
              <span className="footer__logo-icon">L</span>
              <span>Lisanga</span>
            </a>
            <p className="footer__description">
              La plateforme de référence pour découvrir des contenus de qualité et engager des conversations passionnantes.
            </p>
          </div>

          {/* Colonne 2: Plateforme */}
          <div className="footer__col">
            <h3 className="footer__col-title">Plateforme</h3>
            <ul className="footer__links">
              <li><a href="#">Articles récents</a></li>
              <li><a href="#">Forums de discussion</a></li>
              <li><a href="#">Événements</a></li>
              <li><a href="#">À propos</a></li>
            </ul>
          </div>

          {/* Colonne 3: Ressources */}
          <div className="footer__col">
            <h3 className="footer__col-title">Ressources</h3>
            <ul className="footer__links">
              <li><a href="#">Centre d'aide</a></li>
              <li><a href="#">Guide du débutant</a></li>
              <li><a href="#">Conditions d'utilisation</a></li>
              <li><a href="#">Confidentialité</a></li>
            </ul>
          </div>

          {/* Colonne 4: Social & Contact */}
          <div className="footer__col">
            <h3 className="footer__col-title">Suivez-nous</h3>
            <div className="footer__socials">
              <a href="#" aria-label="Twitter" className="footer__social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="footer__social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="footer__social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
            <p className="footer__contact">contact@lisanga.com</p>
          </div>
        </div>

        {/* Barre de Copyright */}
        <div className="footer__bottom">
          <p>© 2026 Lisanga. Tous droits réservés.</p>
          <div className="footer__bottom-links">
            <a href="#">Cookies</a>
            <a href="#">Licences</a>
            <a href="#">Paramètres</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;