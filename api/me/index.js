const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const User = require('../user/user.model');
const MeController = require('./me.controller');
const requestRouter = require('./me_request.js');
const tripRouter = require('./me_trip.js');

const router = new express.Router({ mergeParams: true });
const controller = new MeController(User);

router.use(authenticate);
router.use('/requests', requestRouter);
router.use('/trips', tripRouter);

router.get('/', controller.show.bind(controller));
router.put('/', processQuery, controller.put.bind(controller));
router.put('/unlink/:provider', controller.unlink.bind(controller));

module.exports = router;
