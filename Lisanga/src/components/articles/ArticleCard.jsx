import "./ArticleCard.css";

function ArticleCard({ article }) {
  // Formatage de la date (À REMPLACER par utilitaire de date)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calcul du temps de lecture (estimation: 200 mots/min)
  const readingTime =
    Math.ceil(((article.content?.length || 300) / 200 / 60) * 10) / 10;

  return (
    <article className="article-card">
      {/* Image */}
      <div className="article-card__image-wrapper">
        <img
          src={article.imageUrl || article.image}
          alt={article.title}
          className="article-card__image"
          loading="lazy"
        />
        {article.tag && (
          <span className="article-card__tag">{article.tag}</span>
        )}
      </div>

      {/* Contenu */}
      <div className="article-card__content">
        {/* Contenu */}
        <div className="article-card__content">
          {/* Titre */}
          <h3 className="article-card__title">{article.title}</h3>

          {/* Extrait */}
          <p className="article-card__excerpt">
            {article.description || article.content?.substring(0, 120) + "..."}
          </p>

          {/* Auteur et Date */}
          <div className="article-card__meta">
            {article.author ? (
              <div className="article-card__author">
                <img
                  src={
                    article.author.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.username)}&background=2563eb&color=fff`
                  }
                  alt={article.author.username}
                  className="article-card__avatar"
                />
                <div className="article-card__author-info">
                  <span className="article-card__author-name">
                    {article.author.username}
                  </span>
                  {article.publishedAt && (
                    <time
                      className="article-card__date"
                      dateTime={article.publishedAt}
                    >
                      {new Date(article.publishedAt).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </time>
                  )}
                </div>
              </div>
            ) : (
              <div className="article-card__author">
                <div className="article-card__avatar-placeholder">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="article-card__author-info">
                  <span className="article-card__author-name">
                    Auteur inconnu
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Stats (likes, commentaires) */}
          <div className="article-card__footer">
            <div className="article-card__stats">
              {article.likesCount !== undefined && (
                <span className="article-card__stat">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>{article.likesCount}</span>
                </span>
              )}
              {article.commentsCount !== undefined && (
                <span className="article-card__stat">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                  <span>{article.commentsCount}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay cliquable (pour navigation future) */}
      <div
        className="article-card__overlay"
        role="button"
        tabIndex={0}
        aria-label={`Lire l'article: ${article.title}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </article>
  );
}

export default ArticleCard;
