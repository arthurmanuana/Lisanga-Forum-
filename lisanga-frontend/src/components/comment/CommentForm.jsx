import { useState } from 'react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { validateComment } from '../../utils/validators';
import './CommentForm.css';

function CommentForm({ onSubmit, isLoading, placeholder = 'Écrivez un commentaire...', isReply = false, onCancel, initialValue = '' }) {
  const [content, setContent] = useState(initialValue);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    
    if (touched) {
      validateContent(value);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateContent(content);
  };

  const validateContent = (value) => {
    const validation = validateComment(value);
    setError(validation.error);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched(true);
    
    if (!validateContent(content)) {
      return;
    }
    
    await onSubmit(content);
    setContent('');
    setError(null);
    setTouched(false);
  };

  return (
    <form className={`comment-form ${isReply ? 'comment-form--reply' : ''}`} onSubmit={handleSubmit}>
      <div className="comment-form__field">
        <textarea
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`comment-form__textarea ${touched && error ? 'comment-form__textarea--error' : ''}`}
          rows={isReply ? 3 : 4}
          aria-invalid={touched && !!error}
          aria-describedby={touched && error ? 'comment-error' : undefined}
          disabled={isLoading}
        />
        {touched && error && (
          <p id="comment-error" className="comment-form__error" role="alert">
            {error}
          </p>
        )}
      </div>
      
      <div className="comment-form__actions">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? <Loader size="sm" /> : (isReply ? 'Répondre' : 'Publier le commentaire')}
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;