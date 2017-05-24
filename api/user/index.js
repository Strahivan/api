const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const User = require('./user.model');
const BaseController = require('../base/base.controller');

const router = new express.Router({ mergeParams: true });

router.use(authenticate);
const controller = new BaseController(User, 'user_id');

router.get('/', controller.show.bind(controller), responseHandler);
router.get('/:user_id', processQuery, controller.index.bind(controller), responseHandler);
router.put('/:user_id', controller.update.bind(controller), responseHandler);
router.patch('/:user_id', controller.update.bind(controller), responseHandler);

module.exports = router;
