const express = require('express');
const authenticate = require('../../components/middlewares/authenticate');
const User = require('../user/user.model');
const MeController = require('./me.controller');
const requestRouter = require('../request');
const tripRouter = require('../trip');
const shopRouter = require('../shop');
const userFilter = require('../../components/middlewares/user-filter');

const router = new express.Router({ mergeParams: true });
const controller = new MeController(User);

router.use(authenticate);

router.get('/', controller.show.bind(controller));
router.put('/', controller.update.bind(controller));

router.use('/requests', userFilter('customer_id'), requestRouter);
router.use('/shops', userFilter('owner_id'), shopRouter);
router.use('/trips', userFilter('traveler_id'), tripRouter);

// router.put('/unlink/:provider', controller.unlink.bind(controller));

module.exports = router;
