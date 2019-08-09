const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const endPoints = require('../endpoints.json');
const { mehtodNotAllowed } = require('../error/index');

apiRouter.route('/').get((req, res) => res.status(200).send(endPoints)).all(mehtodNotAllowed);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);


module.exports = { apiRouter };
