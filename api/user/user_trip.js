const express = require('express');
const Trip = require('../trip/trip.model');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const addUser = require('../../components/middlewares/add-user');
const userFilter = require('../../components/middlewares/user-filter');
const requestRouter = require('../request');

const controller = new BaseController(Trip, 'trip_id');

const router = new express.Router({ mergeParams: true });


router.use(authenticate);
router.use(userFilter('traveler_id'));

router.use('/:trip_id/requests', requestRouter);

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:trip_id', controller.show.bind(controller));

router.post('/', addUser('traveler_id'), controller.create.bind(controller));
router.put('/:trip_id', controller.update.bind(controller));
router.patch('/:trip_id', controller.update.bind(controller));
router.delete('/:trip_id', controller.destroy.bind(controller));

module.exports = router;
