const {
  fetchArticleById,
  patchArticleById,
  addCommentById,
  fetchCommentsById,
  selectAllArticles
} = require('../models/articles-model');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id, req.query)
    .then(([article]) => {
      res.status(200).send({ article });
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
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchArticleById(article_id)
    .then()
    .catch(next);

  fetchCommentsById(article_id, sort_by, order)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
