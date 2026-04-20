import { CATEGORIES } from '../../utils/constants';
import './CategoryFilter.css';

function CategoryFilter({ activeCategory, onCategoryChange, articlesCount }) {
  return (
    <div className="category-filter">
      <div className="category-filter__container">
        <div className="category-filter__pills-wrapper" role="group" aria-label="Filtrer par catégorie">
          {CATEGORIES.map(category => {
            const isActive = activeCategory === category.value;
            return (
              <button
                key={category.id}
                type="button"
                className={['category-filter__pill', isActive && 'category-filter__pill--active'].filter(Boolean).join(' ')}
                onClick={() => onCategoryChange(category.value)}
                aria-pressed={isActive}
              >
                {category.label}
              </button>
            );
          })}
        </div>
        {articlesCount !== undefined && (
          <p className="category-filter__count" aria-live="polite">
            <span className="category-filter__count-number">{articlesCount}</span>
            {' '}article{articlesCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}

export default CategoryFilter;
