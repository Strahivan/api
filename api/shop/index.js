const express = require('express');
const apicache = require('apicache');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const Shop = require('./shop.model');
const productRouter = require('../product');
const requestRouter = require('../request');
const batchRouter = require('../batch');
const BaseController = require('../base/base.controller');

const controller = new BaseController(Shop, 'shop_id', 'owner_id');
const cache = apicache.middleware;

const router = new express.Router({ mergeParams: true });

router.use('/:shop_id/products', productRouter);
router.use('/:shop_id/requests',
  (req, res, next) => {
    req.userSpecific = false;
    return next();
  },
  requestRouter);
router.use('/:shop_id/batches', batchRouter);

router.get('/', cache('10 minutes'), processQuery, controller.index.bind(controller), responseHandler);
router.get('/:shop_id', cache('10 minutes'), controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:shop_id', controller.update.bind(controller), responseHandler);
router.patch('/:shop_id', controller.update.bind(controller), responseHandler);
router.delete('/:shop_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;

