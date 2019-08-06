const connection = require('../db/connection');

exports.fetchArticleById = ({ article_id }) => {
  return connection
    .select('*')
    .from('articles')
    .where({ article_id })
    .returning('*');
};
