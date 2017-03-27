const express = require('express');
const Trip = require('./trip.model');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const requestRouter = require('../request');

const controller = new BaseController(Trip, 'trip_id', 'traveler_id');

const router = new express.Router({ mergeParams: true });


router.use('/:trip_id/requests', requestRouter);

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:trip_id', controller.show.bind(controller));

router.use(authenticate);
router.post('/', controller.create.bind(controller));
router.put('/:trip_id', controller.update.bind(controller));
router.patch('/:trip_id', controller.update.bind(controller));
router.delete('/:trip_id', controller.destroy.bind(controller));

module.exports = router;
