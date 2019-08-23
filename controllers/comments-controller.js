const {
  patchCommentById,
  deleteCommentById,
  selectAllComments
} = require('../models/comments-model');

exports.updateCommentById = (req, res, next) => {
  patchCommentById(req.params, req.body)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  deleteCommentById(req.params)
    .then(({ comment }) => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.getAllComments = (req, res, next) => {
  selectAllComments(req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
