const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const Shop = require('./shop.model');
const productRouter = require('../product');
const BaseController = require('../base/base.controller');

const controller = new BaseController(Shop, 'shop_id', 'owner_id');

const router = new express.Router({ mergeParams: true });

router.use('/:shop_id/products', productRouter);

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:shop_id', controller.show.bind(controller));

router.use(authenticate);
router.post('/', controller.create.bind(controller));
router.put('/:shop_id', controller.update.bind(controller));
router.patch('/:shop_id', controller.update.bind(controller));
router.delete('/:shop_id', controller.destroy.bind(controller));

module.exports = router;

