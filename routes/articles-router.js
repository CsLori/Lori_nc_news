const articlesRouter = require('express').Router();
const {
  getArticleById,
  getCommentsById,
  updateArticleById,
  insertCommentById,
  getAllArticles,
  addArticle
} = require('../controllers/articles-controller');
const { mehtodNotAllowed } = require('../error/index');

articlesRouter
  .route('/')
  .get(getAllArticles)
  .post(addArticle)
  .all(mehtodNotAllowed);
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  .all(mehtodNotAllowed);
articlesRouter
  .route('/:article_id/comments')
  .post(insertCommentById)
  .get(getCommentsById)
  .all(mehtodNotAllowed);

module.exports = articlesRouter;
