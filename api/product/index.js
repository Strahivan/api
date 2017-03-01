const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const Product = require('./product.model');
const requestRoutes = require('../request');
const BaseController = require('../base/base.controller');

const controller = new BaseController(Product, 'product_id');

const router = new express.Router({ mergeParams: true });

router.use('/:product_id/requests', requestRoutes);

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:product_id', controller.show.bind(controller));

router.use(authenticate);
router.post('/', controller.create.bind(controller));
router.put('/:product_id', controller.update.bind(controller));
router.patch('/:product_id', controller.update.bind(controller));
router.delete('/:product_id', controller.destroy.bind(controller));

module.exports = router;
