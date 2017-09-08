const express = require('express');
const apicache = require('apicache');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const Product = require('./product.model');
const middlewares = require('./product.middlewares');
const requestRoutes = require('../request');
const BaseController = require('../base/base.controller');

const controller = new BaseController(Product, 'product_id');

const router = new express.Router({ mergeParams: true });
const cache = apicache.middleware;

router.use('/:product_id/requests', requestRoutes);

router.get('/', cache('10 minutes'), processQuery, controller.index.bind(controller), responseHandler);
router.get('/:product_id', cache('10 minutes'), controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', middlewares.calculatePrice, controller.create.bind(controller), responseHandler);
router.put('/:product_id', controller.update.bind(controller), responseHandler);
router.patch('/:product_id', controller.update.bind(controller), responseHandler);
router.delete('/:product_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;

