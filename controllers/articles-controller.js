const { fetchArticleById } = require('../models/articles-model');
const { patchArticleById } = require('../models/articles-model');
const { addCommentById } = require('../models/articles-model');

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
  // console.log(req.params, req.body);
  addCommentById({ ...req.params, ...req.body })
    .then(([comment]) => {
      // console.log(comment);
      res.status(201).send({ comment });
    })
    .catch(console.log);
};
