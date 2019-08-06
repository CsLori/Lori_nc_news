const express = require('express');
const app = express();
const { apiRouter } = require('./routes/api-router');

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  next({ status: 404, msg: 'Not found' });
});

app.use((err, req, res, next) => {
  // console.log(err);
  errCodes = { '22P02': 'Bad request', '42703': 'Invalid user input' };

  if (errCodes[err.code]) {
    res.status(400).send({ msg: errCodes[err.code] });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
module.exports = app;
