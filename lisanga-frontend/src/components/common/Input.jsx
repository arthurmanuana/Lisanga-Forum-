import { useState } from 'react';
import './Input.css';

function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || name;

  const wrapperClasses = [
    'input-wrapper',
    error && 'input-wrapper--error',
    disabled && 'input-wrapper--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="input-field-wrapper">
        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="input-field"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="input-toggle-password"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="input-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
