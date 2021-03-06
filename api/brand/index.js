const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const Brand = require('./brand.model');
const productRouter = require('../product');
const BaseController = require('../base/base.controller');

const controller = new BaseController(Brand, 'brand_id');

const router = new express.Router({ mergeParams: true });

router.use('/:brand_id/products', productRouter);

router.get('/', processQuery, controller.index.bind(controller), responseHandler);
router.get('/:brand_id', controller.show.bind(controller), responseHandler);

router.use(authenticate);
// only admin
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:brand_id', controller.update.bind(controller), responseHandler);
router.patch('/:brand_id', controller.update.bind(controller), responseHandler);
router.delete('/:brand_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;

