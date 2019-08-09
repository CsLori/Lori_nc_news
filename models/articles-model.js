const connection = require('../db/connection');

exports.fetchArticleById = article_id => {
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
    .then(article => {
      // console.log(article, 'controller')
      if (!article.length) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else return article;
    });
};

exports.patchArticleById = ({ article_id }, { inc_vote }) => {
  return connection
    .select('*')
    .from('articles')
    .where({ article_id })
    .increment('votes', inc_vote)
    .returning('*')
    .then(article => {
      if (typeof inc_vote !== 'number') {
        return Promise.reject({ status: 400, msg: 'Bad request' });
      } else if (!article.length) {
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

exports.fetchCommentsById = (article_id, sort_by, order) => {
  return connection
    .select(
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'comments.author',
      'comments.body',
      'comments.article_id'
    )
    .from('comments')
    .where('comments.article_id', '=', article_id)
    .leftJoin('articles', 'articles.article_id', 'comments.article_id')
    .groupBy('comments.comment_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .returning('*');
};

exports.selectAllArticles = ({ sort_by, order, author, topic }) => {
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
    .limit(10)
    .modify(authorQuery => {
      if (author) {
        authorQuery.where('articles.author', '=', author);
      }
    })
    .modify(topicQuery => {
      if (topic) {
        topicQuery.where('articles.topic', '=', topic);
      }
    })
    .then(article => {
      // console.log(article, 'comment count');
      if (!article.length) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else return article;
    });
};
