const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const User = require('./user.model');
const UserController = require('./user.controller');

const router = new express.Router({ mergeParams: true });
const controller = new UserController(User, 'user_id');

router.use(authenticate);

router.get('/me', controller.show.bind(controller));
router.get('/', processQuery, controller.index.bind(controller));
router.put('/:user_id', controller.update.bind(controller));
router.patch('/:user_id', controller.update.bind(controller));

module.exports = router;
