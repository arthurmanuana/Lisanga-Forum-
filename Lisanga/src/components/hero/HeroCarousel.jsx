import { useState, useEffect } from 'react';
import { slides } from '../../data/mockSlides';
import HeroSlide from './HeroSlide';
import './HeroCarousel.css';

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  return (
    <section 
      className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className="hero-carousel__slides">
        {slides.map((slide, index) => (
          <HeroSlide 
            key={slide.id} 
            slide={slide} 
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {/* Contrôles */}
      <button className="hero-carousel__btn hero-carousel__btn--prev" onClick={goPrev} aria-label="Slide précédent">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button className="hero-carousel__btn hero-carousel__btn--next" onClick={goNext} aria-label="Slide suivant">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Indicateurs */}
      <div className="hero-carousel__indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-carousel__indicator ${index === currentIndex ? 'hero-carousel__indicator--active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller au slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>

      {/* Barre de progression */}
      <div className="hero-carousel__progress">
        <div 
          className="hero-carousel__progress-bar" 
          style={{ 
            width: `${((currentIndex + 1) / slides.length) * 100}%`,
            transition: isPaused ? 'none' : 'width 5s linear'
          }}
        ></div>
      </div>
    </section>
  );
}

export default HeroCarousel;