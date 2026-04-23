import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { categorieService } from '../services/categorieService';
import { SORT_OPTIONS, LOCAL_STORAGE_KEYS } from '../utils/constants';
import './Home.css';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEYS.sortPreference) || 'recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [categories, setCategories] = useState([]);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.searchHistory)) || [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return [...new Set(
      articles
        .filter(article => article.title.toLowerCase().includes(query))
        .map(article => article.title)
    )].slice(0, 5);
  }, [articles, searchQuery]);

  const historySuggestions = useMemo(() => {
    if (!searchHistory.length) {
      return [];
    }

    return searchHistory.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchHistory, searchQuery]);

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
  
  const loadCategoryCounts = useCallback(async () => {
    try {
      const counts = await articleService.getCategoryCounts();
      setCategoryCounts(counts?.counts || counts || {});
    } catch {
      setCategoryCounts({});
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categorieService.getCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, []);
  
  useEffect(() => {
    loadArticles();
  }, [activeCategory, debouncedSearch, sortBy, currentPage, loadArticles]);
  
  useEffect(() => {
    loadCategoryCounts();
  }, [loadCategoryCounts]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      return;
    }

    setSearchHistory((previousHistory) => {
      const history = previousHistory.filter(item => item.toLowerCase() !== debouncedSearch.toLowerCase());
      const nextHistory = [debouncedSearch, ...history].slice(0, 5);
      localStorage.setItem(LOCAL_STORAGE_KEYS.searchHistory, JSON.stringify(nextHistory));
      return nextHistory;
    });
  }, [debouncedSearch]);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setShowHistory(true);
  };
  
  const handleSearchFocus = () => {
    setShowHistory(true);
  };

  const handleSearchBlur = () => {
    window.setTimeout(() => setShowHistory(false), 150);
  };

  const handleSuggestionClick = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setShowHistory(false);
  };

  const handleHistoryClick = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setShowHistory(false);
  };
  
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    localStorage.setItem(LOCAL_STORAGE_KEYS.sortPreference, value);
    setCurrentPage(1);
  };
  
  const handleResetFilters = () => {
    setActiveCategory('');
    setSearchQuery('');
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
              categoryCounts={categoryCounts}
              categories={categories}
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
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="home-search-input"
                  aria-label="Rechercher des articles"
                />

                {showHistory && searchQuery.trim() && searchSuggestions.length > 0 && (
                  <div className="home-search-suggestions" role="listbox">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="home-search-suggestion"
                        onMouseDown={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {showHistory && !searchQuery.trim() && historySuggestions.length > 0 && (
                  <div className="home-search-suggestions" role="listbox">
                    <p className="home-search-suggestions-title">Recherches récentes</p>
                    {historySuggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="home-search-suggestion"
                        onMouseDown={() => handleHistoryClick(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="home-sort-select"
                aria-label="Trier par"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {(activeCategory || searchQuery) && (
                <Button variant="outline" onClick={handleResetFilters}>
                  Réinitialiser
                </Button>
              )}
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
