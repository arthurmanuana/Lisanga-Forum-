import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CategoryFilter from '../components/home/CategoryFilter';
import ArticleCard from '../components/home/ArticleCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { articleService } from '../services/articleService';
import { SORT_OPTIONS, PAGINATION } from '../utils/constants';
import './Articles.css';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await articleService.getArticles({
        category: activeCategory,
        search: debouncedSearch,
        sort: sortBy,
        page: currentPage,
        limit: PAGINATION.articlesPerPage
      });
      
      setArticles(response.articles);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedSearch, sortBy, currentPage]);
  
  useEffect(() => {
    loadArticles();
  }, [activeCategory, debouncedSearch, sortBy, currentPage, loadArticles]);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <>
      <Navbar />
      
      <section className="articles">
        <div className="container">
          <div className="articles__header">
            <h1 className="articles__title">Tous les Articles</h1>
            <Link to="/creer-article" className="articles__create-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Créer un article
            </Link>
          </div>
          
          <div className="articles__filters">
            <CategoryFilter 
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              articlesCount={pagination?.totalArticles}
            />
            
            <div className="articles__toolbar">
              <div className="articles__search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input 
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="articles__search-input"
                  aria-label="Rechercher des articles"
                />
              </div>
              
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="articles__sort-select"
                aria-label="Trier par"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading && (
            <div className="articles__loading">
              <Loader size="lg" />
            </div>
          )}
          
          {error && !loading && (
            <ErrorMessage message={error} onRetry={loadArticles} />
          )}
          
          {!loading && !error && articles.length === 0 && (
            <div className="articles__empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <p>Aucun article trouvé</p>
              {(activeCategory || searchQuery) && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    setActiveCategory('');
                    setSearchQuery('');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}
          
          {!loading && !error && articles.length > 0 && (
            <>
              <div className="articles__grid">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              {pagination && pagination.totalPages > 1 && (
                <div className="articles__pagination">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Précédent
                  </Button>
                  
                  <div className="articles__pagination-pages">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`articles__pagination-page ${page === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default Articles;