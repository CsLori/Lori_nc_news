const express = require('express');
const app = express();
const { apiRouter } = require('./routes/api-router');
const {
  sqlErrorHandling,
  customErrorHandling,
  errorHandling500,
  methodNotAllowed
} = require('./error/index');

app.use(express.json());

app.use('/api', apiRouter);

app.use(sqlErrorHandling);
// console.log(err);

app.use(customErrorHandling);

app.use(errorHandling500);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Not found' });
});

// app.use(methodNotAllowed);
module.exports = app;
