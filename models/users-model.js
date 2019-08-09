const connection = require('../db/connection');

exports.fetchUserByUsername = ({ username }) => {
  return connection
    .select('*')
    .from('users')
    .where({ username })
    .returning('*')
    .then(([user]) => {
      if (user === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else return user;
    });
};
