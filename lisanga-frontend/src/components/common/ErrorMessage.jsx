import './ErrorMessage.css';

function ErrorMessage({ message, onRetry, className = '' }) {
  if (!message) return null;

  const wrapperClasses = ['error-message', className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} role="alert" aria-live="assertive">
      <span className="error-message__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </span>
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button type="button" className="error-message__retry" onClick={onRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
