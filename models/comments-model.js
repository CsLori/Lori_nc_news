const connection = require('../db/connection');

exports.patchCommentById = ({ comment_id }, { inc_votes = 0 }) => {
  return connection('comments')
    .where({ comment_id })
    .increment('votes', inc_votes)
    .returning('*')
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: 'Comment Not found' });
      } else if (!inc_votes === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else return comment;
    });
};

exports.deleteCommentById = ({ comment_id }) => {
  if (typeof comment_id !== 'number')
    return connection('comments')
      .where({ comment_id })
      .del();
};