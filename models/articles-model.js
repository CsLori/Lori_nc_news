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
    .join('comments', 'comments.article_id', '=', 'articles.article_id')
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
    .where({article_id} )
    .increment('votes', inc_vote)
    .returning('*')
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else return article;
    });
};
