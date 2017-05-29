const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const batch = require('./batch.model');
const productRouter = require('../product');
const BaseController = require('../base/base.controller');

const controller = new BaseController(batch, 'batch_id');

const router = new express.Router({ mergeParams: true });

router.use('/:batch_id/products', productRouter);

router.get('/', processQuery, controller.index.bind(controller), responseHandler);
router.get('/:batch_id', controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:batch_id', controller.update.bind(controller), responseHandler);
router.patch('/:batch_id', controller.update.bind(controller), responseHandler);
router.delete('/:batch_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;

