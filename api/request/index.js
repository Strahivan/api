const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const addUser = require('../../components/middlewares/add-user');
const userFilter = require('../../components/middlewares/user-filter');
const Request = require('./request.model');
const BaseController = require('../base/base.controller');

const controller = new BaseController(Request, 'request_id');

const router = new express.Router({ mergeParams: true });

router.use(userFilter('customer_id'));

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:request_id', controller.show.bind(controller));

router.use(authenticate);
router.post('/', addUser('customer_id'), controller.create.bind(controller));
router.put('/:request_id', controller.update.bind(controller));
router.patch('/:request_id', controller.update.bind(controller));
router.delete('/:request_id', controller.destroy.bind(controller));

module.exports = router;
