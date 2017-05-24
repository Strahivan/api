const express = require('express');
const zone = require('./zone.model');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');

const controller = new BaseController(zone, 'zone_id');

const router = new express.Router({ mergeParams: true });

router.get('/', processQuery, controller.index.bind(controller), responseHandler);
router.get('/:zone_id', controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:zone_id', controller.update.bind(controller), responseHandler);
router.patch('/:zone_id', controller.update.bind(controller), responseHandler);
router.delete('/:zone_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;
