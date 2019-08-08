const articlesRouter = require('express').Router();
const {
  getArticleById,
  getCommentsById,
  updateArticleById,
  insertCommentById,
  getAllArticles
} = require('../controllers/articles-controller');
const {mehtodNotAllowed} = require('../error/index')



articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  .all(mehtodNotAllowed);
articlesRouter
  .route('/:article_id/comments')
  .post(insertCommentById)
  .get(getCommentsById).all(mehtodNotAllowed);

articlesRouter.route('/').get(getAllArticles);
module.exports = articlesRouter;
