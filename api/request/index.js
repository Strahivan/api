const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const Request = require('./request.model');
const BaseController = require('../base/base.controller');

const controller = new BaseController(Request, 'request_id', 'customer_id');

const router = new express.Router({ mergeParams: true });

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:request_id', controller.show.bind(controller));

router.use(authenticate);
router.post('/', controller.create.bind(controller));
router.put('/:request_id', controller.update.bind(controller));
router.patch('/:request_id', controller.update.bind(controller));
router.delete('/:request_id', controller.destroy.bind(controller));

module.exports = router;
