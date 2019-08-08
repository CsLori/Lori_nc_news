const express = require('express');
const app = express();
const { apiRouter } = require('./routes/api-router');

app.use(express.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log(err);

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
});

app.all('/*', (req, res, next) => {
  next({ status: 404, msg: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Ooops, not your day....' });
});

module.exports = app;
