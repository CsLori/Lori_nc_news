const { fetchArticleById } = require('../models/articles-model');
const { patchArticleById } = require('../models/articles-model');

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.updateArticleById = (req, res, next) => {
  patchArticleById(req.params, req.body)
    .then(({ article }) => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};
