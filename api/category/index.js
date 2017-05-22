const express = require('express');
const Category = require('./category.model');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const productRouter = require('../product');

const controller = new BaseController(Category, 'category_id');

const router = new express.Router({ mergeParams: true });

router.use('/:category_id/products', productRouter);

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:category_id', controller.show.bind(controller));

router.use(authenticate);
router.post('/', controller.create.bind(controller));
router.put('/:category_id', controller.update.bind(controller));
router.patch('/:category_id', controller.update.bind(controller));
router.delete('/:category_id', controller.destroy.bind(controller));

module.exports = router;

