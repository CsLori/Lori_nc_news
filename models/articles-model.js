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
    .then(articles => {
      return articles.map(article => {
        let newObj = {};
        const { author, ...resoOfArticle } = article;
        newObj = { ...resoOfArticle, username: author };
        return newObj;
      });
    })
    .then(article => {
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
    .increment('votes', inc_vote || 0)
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

exports.fetchCommentsById = (article_id, sort_by, order, limit = 10, p) => {
  console.log(limit);
  return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body', 'article_id')
    .from('comments')
    .where('article_id', '=', article_id)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .limit(limit)
    .offset(p * limit - limit);
};

exports.selectAllArticles = (sort_by, order, author, topic, limit = 10, p) => {
  return (
    connection
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
      // .count('articles.article_id AS total_count')
      .orderBy(sort_by || 'created_at', order || 'desc')
      .limit(limit)
      .offset(p * limit - limit)
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
        if (!article.length) {
          return Promise.reject({ status: 404, msg: 'Not found' });
        } else return article;
      })
  );
};

exports.insertArticle = article => {
  return connection
    .insert(article)
    .into('articles')
    .returning('*');
};
