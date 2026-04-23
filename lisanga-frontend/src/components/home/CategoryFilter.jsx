import './CategoryFilter.css';

function CategoryFilter({
  activeCategory,
  onCategoryChange,
  articlesCount,
  categoryCounts = {},
  categories = [],
}) {
  const dynamicCategories = [
    { id: 'all', label: 'Tous', value: '' },
    ...categories.map((category) => ({
      id: String(category.id_categorie),
      label: category.nom,
      value: category.nom,
    })),
  ];

  return (
    <div className="category-filter">
      <div className="category-filter__container">
        <div className="category-filter__pills-wrapper" role="group" aria-label="Filtrer par catégorie">
          {dynamicCategories.map(category => {
            const isActive = activeCategory === category.value;
            const count = categoryCounts[category.value] ?? 0;

            return (
              <button
                key={category.id}
                type="button"
                className={['category-filter__pill', isActive && 'category-filter__pill--active'].filter(Boolean).join(' ')}
                onClick={() => onCategoryChange(category.value)}
                aria-pressed={isActive}
              >
                {category.label}
                <span className="category-filter__pill-count">{count}</span>
              </button>
            );
          })}
        </div>
        {typeof articlesCount === 'number' && (
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
