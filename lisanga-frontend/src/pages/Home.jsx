import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import CategoryFilter from '../components/home/CategoryFilter';
import ArticleCard from '../components/home/ArticleCard';
import CTASection from '../components/home/CTASection';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { articleService } from '../services/articleService';
import { SORT_OPTIONS } from '../utils/constants';
import './Home.css';

function Home() {
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
        limit: 9
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
      
      <Hero />
      
      <section className="home-content">
        <div className="container">
          <div className="home-filters">
            <CategoryFilter 
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              articlesCount={pagination?.totalArticles}
            />
            
            <div className="home-toolbar">
              <div className="home-search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input 
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="home-search-input"
                />
              </div>
              
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="home-sort-select"
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
            <div className="home-loading">
              <Loader size="lg" />
            </div>
          )}
          
          {error && !loading && (
            <ErrorMessage message={error} onRetry={loadArticles} />
          )}
          
          {!loading && !error && articles.length === 0 && (
            <div className="home-empty">
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
              <div className="home-articles-grid">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              {pagination && pagination.totalPages > 1 && (
                <div className="home-pagination">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Précédent
                  </Button>
                  
                  <div className="home-pagination-pages">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`home-pagination-page ${page === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
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
      
      <CTASection />
      
      <Footer />
    </>
  );
}

export default Home;
