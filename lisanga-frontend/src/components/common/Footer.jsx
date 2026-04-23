import './Footer.css';

const FOOTER_COLUMNS = [
  {
    title: 'À propos',
    links: [
      { label: 'Notre mission', href: '/a-propos' },
      { label: 'L\'équipe', href: '/equipe' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carrières', href: '/carrieres' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Articles', href: '/articles' },
      { label: 'Guides', href: '/guides' },
      { label: 'Tutoriels', href: '/tutoriels' },
      { label: 'Documentation', href: '/docs' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { label: 'Forum', href: '/forum' },
      { label: 'Événements', href: '/evenements' },
      { label: 'Newsletter', href: '/newsletter' },
      { label: 'Devenir auteur', href: '/devenir-auteur' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Conditions d\'utilisation', href: '/conditions' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Brand */}
        <div className="footer__brand">
          <a href="/" className="footer__logo" aria-label="Lisanga - Accueil">
            <span className="footer__logo-icon" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#2563EB" />
                <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">L</text>
              </svg>
            </span>
            <span className="footer__logo-text">Lisanga</span>
          </a>
          <p className="footer__tagline">
            La plateforme communautaire pour partager, apprendre et grandir ensemble.
          </p>
          <div className="footer__social">
            {SOCIAL_LINKS.map(social => (
              <a
                key={social.label}
                href={social.href}
                className="footer__social-link"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div className="footer__columns">
          {FOOTER_COLUMNS.map(col => (
            <div key={col.title} className="footer__column">
              <h3 className="footer__column-title">{col.title}</h3>
              <ul className="footer__column-list">
                {col.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="footer__column-link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            &copy; {currentYear} M-Nuru Tech. Tous droits réservés.
          </p>
          <p className="footer__made-with">
            Fait avec passion pour la communauté.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
