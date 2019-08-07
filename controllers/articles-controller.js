const {
  fetchArticleById,
  patchArticleById,
  addCommentById,
  fetchCommentsById
} = require('../models/articles-model');

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.updateArticleById = (req, res, next) => {
  patchArticleById(req.params, req.body)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.insertCommentById = (req, res, next) => {
  addCommentById({ ...req.params, ...req.body })
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(console.log);
};

exports.getCommentsById = (req, res, next) => {
  fetchCommentsById(req.params, req.query)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
