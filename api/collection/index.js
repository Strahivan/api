const express = require('express');
const apicache = require('apicache');
const Collection = require('./collection.model');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const collectionProductRouter = require('../collection_product/index.js');

const controller = new BaseController(Collection, 'collection_id', 'creator_id');

const router = new express.Router({ mergeParams: true });
const cache = apicache.middleware;

router.use('/:collection_id/collectionproducts', collectionProductRouter);

router.get('/', cache('10 minutes'), processQuery, controller.index.bind(controller), responseHandler);
router.get('/:collection_id', cache('10 minutes'), controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:collection_id', controller.update.bind(controller), responseHandler);
router.patch('/:collection_id', controller.update.bind(controller), responseHandler);
router.delete('/:collection_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;
