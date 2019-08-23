const commentsRouter = require('express').Router();
const {
  updateCommentById,
  removeCommentById,
  getAllComments
} = require('../controllers/comments-controller');
const { mehtodNotAllowed } = require('../error/index');

commentsRouter
  .route('/')
  .get(getAllComments)
  .all(mehtodNotAllowed);

commentsRouter
  .route('/:comment_id')
  .patch(updateCommentById)
  .delete(removeCommentById)
  .all(mehtodNotAllowed);

module.exports = commentsRouter;
