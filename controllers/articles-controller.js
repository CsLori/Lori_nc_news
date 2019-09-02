const {
  fetchArticleById,
  patchArticleById,
  addCommentById,
  fetchCommentsById,
  selectAllArticles,
  insertArticle
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
  const { sort_by, order, limit, p } = req.query;

  const article = fetchArticleById(article_id);
  const comments = fetchCommentsById(article_id, sort_by, order, limit, p);

  Promise.all([article, comments])
    .then(([article, comments]) => {
      if (article[0].comment_count === 0) {
        res.status(200).send({ comments: [] });
      } else res.status(200).send({ comments });
      return comments;
    })
    .catch(next);
};
exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;
  // let total = 0;
  // selectAllArticles(sort_by, order, author, topic, 1000);
  // total += articles.length
  //   .then(articles => {
  //     res.status(200).send({ articles });
  //   })
  //   .catch(next);
  selectAllArticles(sort_by, order, author, topic, limit, p)
    .then(articles => {
      console.log(articles);
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  const body = req.body;
  insertArticle(body)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};
