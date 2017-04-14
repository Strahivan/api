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
router.post('/cards', controller.saveCard.bind(controller));
router.post('/charge', controller.charge.bind(controller));
router.put('/', controller.update.bind(controller));

router.use('/requests', userFilter(), requestRouter);
router.use('/shops', userFilter(), shopRouter);
router.use('/trips', userFilter(), tripRouter);

// router.put('/unlink/:provider', controller.unlink.bind(controller));

module.exports = router;
