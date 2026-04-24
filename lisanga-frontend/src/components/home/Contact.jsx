import { useState } from 'react';
import Button from '../common/Button';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset status après 3 secondes
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div className="contact__container">
        <div className="contact__header">
          <h2 id="contact-heading" className="contact__title">
            Contact
          </h2>
          <p className="contact__subtitle">
            Une question ? Une suggestion ? N'hésitez pas à nous contacter.
          </p>
        </div>

        <div className="contact__content">
          <div className="contact__info">
            <div className="contact__info-item">
              <div className="contact__info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="contact__info-text">
                <h4>Email</h4>
                <p>contact@lisanga.com</p>
              </div>
            </div>

            <div className="contact__info-item">
              <div className="contact__info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="contact__info-text">
                <h4>Localisation</h4>
                <p>Kinshasa, RD Congo</p>
              </div>
            </div>

            <div className="contact__info-item">
              <div className="contact__info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="contact__info-text">
                <h4>Heures d'ouverture</h4>
                <p>Lun - Ven: 9h00 - 18h00</p>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__form-group">
              <label htmlFor="name" className="contact__label">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact__input"
                placeholder="Votre nom"
                required
              />
            </div>

            <div className="contact__form-group">
              <label htmlFor="email" className="contact__label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact__input"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="contact__form-group">
              <label htmlFor="message" className="contact__label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact__textarea"
                placeholder="Votre message..."
                rows="5"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="contact__submit"
            >
              {isSubmitting ? (
                <span className="contact__submitting">
                  <span className="contact__spinner"></span>
                  Envoi en cours...
                </span>
              ) : (
                'Envoyer le message'
              )}
            </Button>

            {submitStatus === 'success' && (
              <div className="contact__success" role="alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Message envoyé avec succès !
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;