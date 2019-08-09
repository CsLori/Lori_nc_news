const {
  patchCommentById,
  deleteCommentById
} = require('../models/comments-model');

exports.updateCommentById = (req, res, next) => {
  patchCommentById(req.params, req.body)
    .then(comment => {
      if (!comment.length) {
        res.status(404).send({ msg: 'Comment Not found' });
      } else res.status(200).send({ comment });
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
