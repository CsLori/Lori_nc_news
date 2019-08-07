const connection = require('../db/connection');

exports.fetchArticleById = ({ article_id }) => {
  return connection
    .select(
      'articles.author',
      'title',
      'articles.article_id',
      'articles.body',
      'topic',
      'articles.created_at',
      'articles.votes'
    )
    .from('articles')
    .where('articles.article_id', '=', article_id)
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .groupBy('articles.article_id')
    .count('comments.article_id as comment_count')
    .returning('*')
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else return article;
    });
};

exports.patchArticleById = ({ article_id, inc_vote }) => {
  return connection
    .select('*')
    .from('articles')
    .where({ article_id })
    .increment('votes', inc_vote)
    .returning('*')
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else return article;
    });
};

exports.addCommentById = comment => {
  return connection
    .insert(comment)
    .into('comments')
    .returning('*');
};

exports.fetchCommentsById = ({ article_id }, { sort_by, order }) => {
  return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body', 'article_id')
    .from('comments')
    .where({ article_id })
    .orderBy(sort_by || 'created_at', order || 'desc')
    .returning('*');
};

exports.selectAllArticles = ({ sort_by, order }) => {
  return connection
    .select(
      'articles.author',
      'title',
      'articles.article_id',
      'topic',
      'articles.created_at',
      'articles.votes'
    )
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .count('comments.article_id AS comment_count')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .returning('*');
};
