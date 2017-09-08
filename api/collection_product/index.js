const express = require('express');
const CollectionProduct = require('./collection_product.model');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');

const controller = new BaseController(CollectionProduct, 'collectionproduct_id');

const router = new express.Router({ mergeParams: true });

router.get('/', processQuery, controller.index.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.delete('/:collectionproduct_id', controller.delete.bind(controller), responseHandler);

module.exports = router;

