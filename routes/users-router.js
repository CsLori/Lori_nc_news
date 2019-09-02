const usersRouter = require('express').Router();
const {
  getUserByUsername,
  getAllUsers
} = require('../controllers/users-controllers');
const { mehtodNotAllowed } = require('../error/index');

usersRouter
  .route('/')
  .get(getAllUsers)
  .all(mehtodNotAllowed);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(mehtodNotAllowed);

module.exports = usersRouter;
