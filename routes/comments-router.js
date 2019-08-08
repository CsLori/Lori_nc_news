const commentsRouter = require('express').Router();
const {
  updateCommentById,
  removeCommentById
} = require('../controllers/comments-controller');
const {mehtodNotAllowed} = require('../error/index');

commentsRouter
  .route('/:comment_id')
  .patch(updateCommentById)
  .delete(removeCommentById)
  .all(mehtodNotAllowed);

module.exports = commentsRouter;
