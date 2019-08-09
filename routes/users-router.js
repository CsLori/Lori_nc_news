const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users-controllers');
const { mehtodNotAllowed } = require('../error/index');

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(mehtodNotAllowed);

module.exports = usersRouter;
