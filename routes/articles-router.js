const articlesRouter = require('express').Router();
const {
  getArticleById,
  getCommentsById,
  updateArticleById,
  insertCommentById
} = require('../controllers/articles-controller');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById);
articlesRouter
  .route('/:article_id/comments')
  .post(insertCommentById)
  .get(getCommentsById);
module.exports = articlesRouter;
