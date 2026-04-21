import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { articleService } from '../services/articleService';
import { validateArticleTitle, validateArticleContent, validateCategory } from '../utils/validators';
import { CATEGORIES } from '../utils/constants';
import './EditArticle.css';

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsFetching(true);
        const response = await articleService.getArticleById(id);
        const article = response.article;
        
        setFormData({
          title: article.title || '',
          content: article.content || '',
          category: article.category || ''
        });
        
        if (article.imageUrl) {
          setOriginalImageUrl(article.imageUrl);
          setImagePreview(article.imageUrl);
        }
      } catch (err) {
        setSubmitError(err.message || 'Erreur lors du chargement de l\'article');
      } finally {
        setIsFetching(false);
      }
    };
    
    if (id) {
      fetchArticle();
    }
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
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
      
      await articleService.updateArticle(id, data);
      
      navigate(`/articles/${id}`);
    } catch (err) {
      setSubmitError(err.message || 'Erreur lors de la mise à jour de l\'article');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
    return (
      <>
        <Navbar />
        <div className="edit-article__loading">
          <Loader size="lg" />
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      
      <section className="edit-article">
        <div className="container">
          <div className="edit-article__header">
            <h1 className="edit-article__title">Modifier l'Article</h1>
            <p className="edit-article__subtitle">
              Mettez à jour votre article pour refléter vos changements
            </p>
          </div>
          
          <form className="edit-article__form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div className="edit-article__error">
                <ErrorMessage message={submitError} />
              </div>
            )}
            
            <div className="edit-article__field">
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
            
            <div className="edit-article__field">
              <label className="input-label">
                Contenu de l'article <span className="input-required" aria-hidden="true">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Rédigez votre article ici..."
                className={`edit-article__textarea ${touched.content && errors.content ? 'edit-article__textarea--error' : ''}`}
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
            
            <div className="edit-article__field">
              <label className="input-label" htmlFor="category">
                Catégorie <span className="input-required" aria-hidden="true">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`edit-article__select ${touched.category && errors.category ? 'edit-article__select--error' : ''}`}
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
            
            {imagePreview && (
              <div className="edit-article__field">
                <label className="input-label">Image de couverture actuelle</label>
                <div className="edit-article__current-image">
                  <img src={imagePreview} alt="Image actuelle" />
                </div>
                <p className="edit-article__image-hint">
                  Pour remplacer l'image, utilisez la fonctionnalité d'upload dans la version complète.
                </p>
              </div>
            )}
            
            <div className="edit-article__actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/articles/${id}`)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? <Loader size="sm" /> : 'Enregistrer les modifications'}
              </Button>
            </div>
          </form>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default EditArticle;