import { api, isMockMode } from './api';
import { delay, mockComments } from './mockData';

export const commentService = {
  getCommentsByArticle: async (articleId) => {
    if (isMockMode()) {
      await delay();
      
      const articleComments = mockComments.filter(c => c.articleId === articleId);
      
      return { comments: articleComments };
    }
    
    return api.get(`/articles/${articleId}/comments`);
  },
  
  addComment: async (articleId, content, parentId = null) => {
    if (isMockMode()) {
      await delay(800);
      
      const newComment = {
        id: `c${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        author: {
          id: '1',
          username: 'current_user',
          avatarUrl: null
        },
        articleId,
        parentId,
        replies: [],
        createdAt: new Date().toISOString()
      };
      
      return { comment: newComment, message: 'Commentaire ajouté avec succès' };
    }
    
    return api.post(`/articles/${articleId}/comments`, { content, parentId });
  },
  
  deleteComment: async (commentId) => {
    if (isMockMode()) {
      await delay();
      
      return { message: 'Commentaire supprimé avec succès' };
    }
    
    return api.delete(`/comments/${commentId}`);
  }
};