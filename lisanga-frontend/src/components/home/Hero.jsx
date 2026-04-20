import './Hero.css';

function Hero() {
  return (
    <section className="hero" aria-label="Section principale">
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__content">
        <span className="hero__badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2v2h-2zm0-8h2v6h-2z"/>
          </svg>
          COMMUNAUTÉ
        </span>
        <h1 className="hero__title">
          Partagez vos idées,<br />
          inspirez la communauté
        </h1>
        <p className="hero__subtitle">
          Rejoignez des milliers d&apos;auteurs et de lecteurs passionnés. Découvrez des articles de qualité,
          partagez votre expertise et contribuez à une communauté engagée.
        </p>
        <a href="/articles" className="hero__cta">
          Explorer les articles
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </section>
  );
}

export default Hero;
