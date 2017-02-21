const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const User = require('./user.model');
const BaseController = require('../base/base.controller');

const router = new express.Router({ mergeParams: true });

router.use(authenticate);
const controller = new BaseController(User, 'user_id');

router.get('/', controller.show.bind(controller));
router.get('/:user_id', processQuery, controller.index.bind(controller));
router.put('/:user_id', controller.update.bind(controller));
router.patch('/:user_id', controller.update.bind(controller));

module.exports = router;
