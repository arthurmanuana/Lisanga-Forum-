import { useState, useMemo } from 'react';
import { slides } from '../../data/mockSlides';
import FilterBar from './FilterBar';
import ArticleCard from './ArticleCard';
import './ArticlesSection.css';

function ArticlesSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: 'Tous', count: 12 },
    { id: 'tech', name: 'Technologie', count: 5 },
    { id: 'design', name: 'Design', count: 4 },
    { id: 'business', name: 'Business', count: 3 },
  ];
  
  const filteredArticles = useMemo(() => {
    let result = [...slides];

    if (selectedCategory !== 'all') {
      result = result.filter(article => 
        article.tag?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleFilterChange = (newFilters) => {
    if (newFilters.category !== undefined) setSelectedCategory(newFilters.category);
    if (newFilters.search !== undefined) setSearchQuery(newFilters.search);
    if (newFilters.sort !== undefined) setSortBy(newFilters.sort);
  };

  return (
    <section className="articles-section" id="articles">
      <div className="container">
        {/* Header */}
        <div className="articles-section__header">
          <h2 className="articles-section__title">Les Articles</h2>
          <p className="articles-section__subtitle">
            Vivez tout ce qu'il faut
          </p>
        </div>

        {/* Filtres centrés */}
        <div className="articles-section__filters-wrapper">
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onFilterChange={handleFilterChange}
            resultsCount={filteredArticles.length}
          />
        </div>

        {/* Grille */}
        <div className="articles-section__grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article}
              />
            ))
          ) : (
            <div className="articles-section__empty">
              <div className="articles-section__empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                  <path d="M11 8v4M11 16v.01"/>
                </svg>
              </div>
              <h3>Aucun article trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
              <button 
                className="btn btn-primary"
                onClick={() => handleFilterChange({ category: 'all', search: '', sort: 'newest' })}
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ArticlesSection;