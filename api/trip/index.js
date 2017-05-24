const express = require('express');
const Trip = require('./trip.model');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const requestRouter = require('../request');

const controller = new BaseController(Trip, 'trip_id', 'traveler_id');

const router = new express.Router({ mergeParams: true });


router.use('/:trip_id/requests', requestRouter);

router.get('/', processQuery, controller.index.bind(controller), responseHandler);
router.get('/:trip_id', controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:trip_id', controller.update.bind(controller), responseHandler);
router.patch('/:trip_id', controller.update.bind(controller), responseHandler);
router.delete('/:trip_id', controller.destroy.bind(controller), responseHandler);

module.exports = router;
