exports.sqlErrorHandling = (err, req, res, next) => {
  // console.log(err)
  errCodes = {
    '22P02': 'Bad request',
    '23503': 'Not found',
    '42703': 'Invalid user input'
  };
  if (
    err.code === '23503' &&
    err.constraint === 'comments_article_id_foreign'
  ) {
    res.status(422).send({ msg: 'Id does not exist' });
  }
  if (errCodes[err.code]) {
    res.status(400).send({ msg: errCodes[err.code] });
  } else next(err);
};

exports.customErrorHandling = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.mehtodNotAllowed = (req, res, next) => {
res.status(405).send({msg: "Method not allowed"})
}
exports.errorHandling500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Ooops, not your day....' });
};

