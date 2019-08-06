const articlesRouter = require('express').Router();
const { getArticleById } = require('../controllers/articles-controller');
const { updateArticleById} = require('../controllers/articles-controller')
const { insertCommentById} = require('../controllers/articles-controller')

articlesRouter.route('/:article_id').get(getArticleById).patch(updateArticleById);
articlesRouter.route('/:article_id/comments').post(insertCommentById)
module.exports = articlesRouter;
