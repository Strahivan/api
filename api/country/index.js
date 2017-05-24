const express = require('express');
const Country = require('./country.model');
const zoneRouter = require('../zone');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');

const controller = new BaseController(Country, 'country_id');

const router = new express.Router({ mergeParams: true });
router.use('/:country_id/zones', zoneRouter);

router.get('/', processQuery, controller.index.bind(controller), responseHandler);
router.get('/:country_id', controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:country_id', controller.update.bind(controller), responseHandler);
router.patch('/:country_id', controller.update.bind(controller), responseHandler);
router.delete('/:country_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;
