const { topicData, articleData, commentData, userData } = require('../index');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData);
      const usersInsertions = knex('users').insert(userData);
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticleData = formatDates(articleData);
      return knex('articles')
        .insert(formattedArticleData)
        .returning('*');
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, 'title', 'article_id');
      const formattedComments = formatComments(commentData, articleRef);
      console.log(formatComments);
      return knex('comments').insert(formattedComments);
    });
};
