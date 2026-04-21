import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { articleService } from '../services/articleService';
import { validateArticleTitle, validateArticleContent, validateCategory, validateImage } from '../utils/validators';
import { CATEGORIES } from '../utils/constants';
import './CreateArticle.css';

function CreateArticle() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      const file = files[0];
      const validation = validateImage(file);
      
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, image: validation.error }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (touched[name]) {
        validateField(name, value);
      }
    }
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };
  
  const validateField = (name, value) => {
    let validation;
    
    switch (name) {
      case 'title':
        validation = validateArticleTitle(value);
        break;
      case 'content':
        validation = validateArticleContent(value);
        break;
      case 'category':
        validation = validateCategory(value);
        break;
      default:
        return;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: validation.error
    }));
  };
  
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    setErrors(prev => ({ ...prev, image: null }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ title: true, content: true, category: true });
    
    const titleValidation = validateArticleTitle(formData.title);
    const contentValidation = validateArticleContent(formData.content);
    const categoryValidation = validateCategory(formData.category);
    
    const hasErrors = !titleValidation.isValid || !contentValidation.isValid || !categoryValidation.isValid;
    
    setErrors({
      title: titleValidation.error,
      content: contentValidation.error,
      category: categoryValidation.error
    });
    
    if (hasErrors) {
      return;
    }
    
    try {
      setIsLoading(true);
      setSubmitError(null);
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      const response = await articleService.createArticle(data);
      
      navigate(`/articles/${response.article.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Erreur lors de la publication de l\'article');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      
      <section className="create-article">
        <div className="container">
          <div className="create-article__header">
            <h1 className="create-article__title">Créer un Article</h1>
            <p className="create-article__subtitle">
              Partagez vos connaissances et vos idées avec la communauté
            </p>
          </div>
          
          <form className="create-article__form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div className="create-article__error">
                <ErrorMessage message={submitError} />
              </div>
            )}
            
            <div className="create-article__field">
              <Input
                label="Titre de l'article"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Entrez un titre accrocheur..."
                error={touched.title ? errors.title : null}
                required
              />
            </div>
            
            <div className="create-article__field">
              <label className="input-label">
                Contenu de l'article <span className="input-required" aria-hidden="true">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Rédigez votre article ici..."
                className={`create-article__textarea ${touched.content && errors.content ? 'create-article__textarea--error' : ''}`}
                rows={12}
                aria-invalid={touched.content && !!errors.content}
                aria-describedby={touched.content && errors.content ? 'content-error' : undefined}
              />
              {touched.content && errors.content && (
                <p id="content-error" className="input-error" role="alert">
                  {errors.content}
                </p>
              )}
            </div>
            
            <div className="create-article__field">
              <label className="input-label" htmlFor="category">
                Catégorie <span className="input-required" aria-hidden="true">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`create-article__select ${touched.category && errors.category ? 'create-article__select--error' : ''}`}
                aria-invalid={touched.category && !!errors.category}
              >
                <option value="">Sélectionnez une catégorie</option>
                {CATEGORIES.filter(cat => cat.value !== '').map(category => (
                  <option key={category.id} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {touched.category && errors.category && (
                <p className="input-error" role="alert">
                  {errors.category}
                </p>
              )}
            </div>
            
            <div className="create-article__field">
              <label className="input-label">
                Image de couverture
              </label>
              
              {!imagePreview ? (
                <div className="create-article__upload">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleChange}
                    className="create-article__file-input"
                  />
                  <label htmlFor="image" className="create-article__upload-label">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Cliquez pour télécharger une image</span>
                    <span className="create-article__upload-hint">JPG, PNG ou WebP (max 5 Mo)</span>
                  </label>
                </div>
              ) : (
                <div className="create-article__preview">
                  <img src={imagePreview} alt="Aperçu" className="create-article__preview-image" />
                  <button
                    type="button"
                    className="create-article__preview-remove"
                    onClick={removeImage}
                    aria-label="Supprimer l'image"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
              
              {errors.image && (
                <p className="input-error" role="alert">
                  {errors.image}
                </p>
              )}
            </div>
            
            <div className="create-article__actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/articles')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? <Loader size="sm" /> : 'Publier l\'article'}
              </Button>
            </div>
          </form>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default CreateArticle;