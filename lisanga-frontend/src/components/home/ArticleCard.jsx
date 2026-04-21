import { formatDate } from '../../utils/formatters';
import './ArticleCard.css';

function ArticleCard({ article }) {
  const {
    id,
    title,
    excerpt,
    imageUrl,
    category,
    author,
    createdAt,
    likesCount = 0,
    commentsCount = 0,
  } = article;

  return (
    <article className="article-card">
      <a href={`/articles/${id}`} className="article-card__image-link" tabIndex={-1} aria-hidden="true">
        <div className="article-card__image-wrapper">
          <img
            src={imageUrl}
            alt={title}
            className="article-card__image"
            loading="lazy"
            decoding="async"
          />
          {category && (
            <span className="article-card__category-badge">{category}</span>
          )}
        </div>
      </a>

      <div className="article-card__body">
        <h3 className="article-card__title">
          <a href={`/articles/${id}`} className="article-card__title-link">
            {title}
          </a>
        </h3>

        {excerpt && (
          <p className="article-card__excerpt">{excerpt}</p>
        )}

        <div className="article-card__footer">
          <div className="article-card__author">
            {author?.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.username}
                className="article-card__avatar"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="article-card__avatar article-card__avatar--initials" aria-hidden="true">
                {author?.username ? author.username.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            <div className="article-card__author-info">
              <span className="article-card__author-name">{author?.username || 'Auteur inconnu'}</span>
              <time className="article-card__date" dateTime={createdAt}>
                {formatDate(createdAt)}
              </time>
            </div>
          </div>

          <div className="article-card__counters">
            <span className="article-card__counter" aria-label={`${likesCount} j'aime`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likesCount}
            </span>
            <span className="article-card__counter" aria-label={`${commentsCount} commentaires`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {commentsCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
