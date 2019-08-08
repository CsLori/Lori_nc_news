const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics-controller');
const { mehtodNotAllowed } = require('../error/index');

topicsRouter
  .route('/')
  .get(getTopics)
  .all(mehtodNotAllowed);

module.exports = topicsRouter;
