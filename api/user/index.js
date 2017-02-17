const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const User = require('./user.model');
const UserController = require('./user.controller');
const requestRouter = require('./user_request');
const tripRouter = require('./user_trip');

const router = new express.Router({ mergeParams: true });

router.use('/me/requests', requestRouter);
router.use('/me/trips', tripRouter);

router.use(authenticate);
const controller = new UserController(User, 'user_id');

router.get('/me', controller.show.bind(controller));
router.get('/', processQuery, controller.index.bind(controller));
router.put('/me', controller.update.bind(controller));
router.patch('/me', controller.update.bind(controller));

module.exports = router;
