const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const Shop = require('./shop.model');
const productRouter = require('../product');
const requestRouter = require('../request');
const BaseController = require('../base/base.controller');

const controller = new BaseController(Shop, 'shop_id', 'owner_id');

const router = new express.Router({ mergeParams: true });

router.use('/:shop_id/products', productRouter);
router.use('/:shop_id/requests', requestRouter);

router.get('/', processQuery, controller.index.bind(controller), responseHandler);
router.get('/:shop_id', controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:shop_id', controller.update.bind(controller), responseHandler);
router.patch('/:shop_id', controller.update.bind(controller), responseHandler);
router.delete('/:shop_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;

