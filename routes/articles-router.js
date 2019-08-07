const articlesRouter = require('express').Router();
const {
  getArticleById,
  getCommentsById,
  updateArticleById,
  insertCommentById,
  getAllArticles
} = require('../controllers/articles-controller');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById);
articlesRouter
  .route('/:article_id/comments')
  .post(insertCommentById)
  .get(getCommentsById);

articlesRouter.route('/').get(getAllArticles);
module.exports = articlesRouter;
