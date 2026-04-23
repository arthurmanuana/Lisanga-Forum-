import { useState, useEffect } from 'react';
import { articleService } from '../../services/articleService';
import './LikeDislike.css';

function LikeDislike({ articleId, initialLikes, initialDislikes, onVoteUpdate }) {
  const [likesCount, setLikesCount] = useState(initialLikes || 0);
  const [dislikesCount, setDislikesCount] = useState(initialDislikes || 0);
  const [userVote, setUserVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLikesCount(initialLikes || 0);
    setDislikesCount(initialDislikes || 0);
  }, [initialLikes, initialDislikes]);

  useEffect(() => {
    let active = true;

    const loadReactions = async () => {
      try {
        const [counts, vote] = await Promise.all([
          articleService.getReactionCounts(articleId),
          articleService.getUserVote(articleId),
        ]);

        if (!active) return;

        const nextLikes = Number(counts?.likes ?? 0);
        const nextDislikes = Number(counts?.dislikes ?? 0);
        setLikesCount(nextLikes);
        setDislikesCount(nextDislikes);
        setUserVote(vote);
        onVoteUpdate?.({ likes: nextLikes, dislikes: nextDislikes });
      } catch (err) {
        console.error('Erreur chargement réactions:', err);
      }
    };

    if (articleId) {
      loadReactions();
    }

    return () => {
      active = false;
    };
  }, [articleId, onVoteUpdate]);

  const applyCounts = (counts) => {
    const nextLikes = Number(counts?.likes ?? likesCount);
    const nextDislikes = Number(counts?.dislikes ?? dislikesCount);
    setLikesCount(nextLikes);
    setDislikesCount(nextDislikes);
    onVoteUpdate?.({ likes: nextLikes, dislikes: nextDislikes });
  };

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (userVote === 'like') {
        const result = await articleService.removeReaction(articleId);
        setUserVote(null);
        applyCounts(result?.counts);
      } else {
        const result = await articleService.likeArticle(articleId);
        setUserVote('like');
        applyCounts(result?.counts);
      }
    } catch (err) {
      console.error('Erreur lors du like:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (userVote === 'dislike') {
        const result = await articleService.removeReaction(articleId);
        setUserVote(null);
        applyCounts(result?.counts);
      } else {
        const result = await articleService.dislikeArticle(articleId);
        setUserVote('dislike');
        applyCounts(result?.counts);
      }
    } catch (err) {
      console.error('Erreur lors du dislike:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="like-dislike">
      <button
        type="button"
        className={`like-dislike__btn like-dislike__btn--like ${userVote === 'like' ? 'like-dislike__btn--active' : ''}`}
        onClick={handleLike}
        disabled={isLoading}
        aria-label={userVote === 'like' ? 'Retirer mon like' : 'Liker cet article'}
        aria-pressed={userVote === 'like'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={userVote === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className="like-dislike__count">{likesCount}</span>
      </button>

      <button
        type="button"
        className={`like-dislike__btn like-dislike__btn--dislike ${userVote === 'dislike' ? 'like-dislike__btn--active' : ''}`}
        onClick={handleDislike}
        disabled={isLoading}
        aria-label={userVote === 'dislike' ? 'Retirer mon dislike' : 'Disliker cet article'}
        aria-pressed={userVote === 'dislike'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={userVote === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3h2.62z" />
          <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
        <span className="like-dislike__count">{dislikesCount}</span>
      </button>
    </div>
  );
}

export default LikeDislike;