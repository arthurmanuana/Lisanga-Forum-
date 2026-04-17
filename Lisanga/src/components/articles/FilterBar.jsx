import { useState } from 'react';
import './FilterBar.css';

function FilterBar({
  categories,
  selectedCategory,
  searchQuery,
  sortBy,
  onFilterChange,
  resultsCount
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleCategoryChange = (categoryId) => {
    onFilterChange({ category: categoryId });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleSortChange = () => {
    const newSort = sortBy === 'newest' ? 'popular' : 'newest';
    onFilterChange({ sort: newSort });
  };

  return (
    <div className="filter-bar">
      {/* Ligne supérieure : Recherche + Toggle Tri */}
      <div className="filter-bar__top">
        {/* Recherche flottante */}
        <div className={`filter-bar__search ${isSearchFocused ? 'filter-bar__search--focused' : ''}`}>
          <svg className="filter-bar__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="filter-bar__input"
          />
          {searchQuery && (
            <button 
              className="filter-bar__clear"
              onClick={() => onFilterChange({ search: '' })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
          {/* Effet de lueur animé */}
          <div className="filter-bar__search-glow"></div>
        </div>

        {/* Toggle Tri Animé */}
        <button 
          className={`filter-bar__sort-toggle ${sortBy === 'popular' ? 'filter-bar__sort-toggle--active' : ''}`}
          onClick={handleSortChange}
        >
          <span className="filter-bar__sort-label">Trier par</span>
          <span className="filter-bar__sort-value">
            {sortBy === 'newest' ? 'Récents' : 'Populaires'}
          </span>
          <svg className={`filter-bar__sort-icon ${sortBy === 'popular' ? 'filter-bar__sort-icon--rotated' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 4h13M3 8h9M3 12h5M17 16l4-4-4-4M21 12H11"/>
          </svg>
        </button>
      </div>

      {/* Catégories sous forme de "Chips" flottantes */}
      <div className="filter-bar__categories">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`filter-bar__chip ${
              selectedCategory === category.id ? 'filter-bar__chip--active' : ''
            }`}
            style={{ '--delay': index * 0.05 }}
          >
            <span className="filter-bar__chip-text">{category.name}</span>
            <span className={`filter-bar__chip-count ${
              selectedCategory === category.id ? 'filter-bar__chip-count--active' : ''
            }`}>
              {category.count}
            </span>
            {selectedCategory === category.id && (
              <div className="filter-bar__chip-glow"></div>
            )}
          </button>
        ))}
      </div>

      {/* Compteur de résultats minimaliste */}
      <div className="filter-bar__results">
        <span className="filter-bar__results-count">{resultsCount}</span>
        <span className="filter-bar__results-label">
          {resultsCount > 1 ? 'résultats' : 'résultat'}
        </span>
      </div>
    </div>
  );
}

export default FilterBar;