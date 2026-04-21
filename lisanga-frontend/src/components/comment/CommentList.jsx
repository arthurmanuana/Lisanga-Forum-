import { formatDate } from '../../utils/formatters';
import './CommentList.css';

function CommentList({ comments, onReply, onDelete, currentUserId }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="comment-list__empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p>Aucun commentaire pour le moment</p>
        <p className="comment-list__empty-hint">Soyez le premier à commenter cet article !</p>
      </div>
    );
  }

  const renderComment = (comment, isReply = false) => {
    const canDelete = currentUserId && (currentUserId === comment.author?.id || comment.author?.role === 'admin');

    return (
      <div key={comment.id} className={`comment ${isReply ? 'comment--reply' : ''}`}>
        <div className="comment__avatar">
          {comment.author?.avatarUrl ? (
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.username}
              className="comment__avatar-img"
            />
          ) : (
            <div className="comment__avatar-initials">
              {comment.author?.username?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>

        <div className="comment__body">
          <div className="comment__header">
            <span className="comment__author">{comment.author?.username || 'Utilisateur'}</span>
            <time className="comment__date" dateTime={comment.createdAt}>
              {formatDate(comment.createdAt)}
            </time>
          </div>

          <p className="comment__content">{comment.content}</p>

          <div className="comment__actions">
            {!isReply && onReply && (
              <button
                type="button"
                className="comment__action"
                onClick={() => onReply(comment.id)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Répondre
              </button>
            )}
            {canDelete && onDelete && (
              <button
                type="button"
                className="comment__action comment__action--danger"
                onClick={() => onDelete(comment.id)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Supprimer
              </button>
            )}
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="comment__replies">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="comment-list">
      <h2 className="comment-list__title">
        Commentaires ({comments.length})
      </h2>
      <div className="comment-list__items">
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
}

export default CommentList;