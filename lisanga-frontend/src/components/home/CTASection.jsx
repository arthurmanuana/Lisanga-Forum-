import Button from '../common/Button';
import './CTASection.css';

function CTASection() {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-section__container">
        <h2 id="cta-heading" className="cta-section__title">
          Prêt à rejoindre la communauté Lisanga ?
        </h2>
        <p className="cta-section__subtitle">
          Créez un compte gratuitement et commencez à partager vos idées avec des milliers de lecteurs passionnés.
        </p>
        <div className="cta-section__actions">
          <Button
            variant="primary"
            size="lg"
            onClick={() => { window.location.href = '/register'; }}
          >
            Créer un compte gratuit
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="cta-section__btn-secondary"
            onClick={() => { window.location.href = '/articles'; }}
          >
            Explorer les articles
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
