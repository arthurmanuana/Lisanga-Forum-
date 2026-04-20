import './Loader.css';

function Loader({ size = 'md', label = 'Chargement...' }) {
  const classes = [
    'loader',
    size !== 'md' && `loader--${size}`
  ].filter(Boolean).join(' ');

  return (
    <div className="loader-wrapper" role="status" aria-label={label}>
      <div className={classes}>
        <svg
          className="loader-circle"
          viewBox="0 0 50 50"
          aria-hidden="true"
        >
          <circle
            className="loader-track"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />
          <circle
            className="loader-spinner"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="loader-sr-only">{label}</span>
    </div>
  );
}

export default Loader;
