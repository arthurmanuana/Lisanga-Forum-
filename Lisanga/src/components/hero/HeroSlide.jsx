import './HeroSlide.css';

function HeroSlide({ slide, isActive }) {
  return (
    <div className={`hero-slide ${isActive ? 'hero-slide--active' : ''}`}>
      <div className="hero-slide__image-wrapper">
        <img 
          src={slide.image} 
          alt={slide.title}
          className="hero-slide__image"
        />
        <div className="hero-slide__overlay"></div>
      </div>
      
      <div className="hero-slide__content">
        <div className="container">
          <span className="hero-slide__tag">{slide.tag}</span>
          <h1 className="hero-slide__title">{slide.title}</h1>
          <p className="hero-slide__description">{slide.description}</p>
          <a href={slide.buttonLink} className="btn btn-primary hero-slide__button">
            {slide.buttonText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default HeroSlide;