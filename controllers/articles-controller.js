const { fetchArticleById } = require('../models/articles-model');

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params).then(article => {
    res.status(200).send({ article: article[0] });
  });
};
