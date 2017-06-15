const express = require('express');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const User = require('../user/user.model');
const MeController = require('./me.controller');
const requestRouter = require('../request');
const tripRouter = require('../trip');
const shopRouter = require('../shop');
const addUserFilter = require('../../components/middlewares/user-filter');

const router = new express.Router({ mergeParams: true });
const controller = new MeController(User);

router.use(authenticate);

router.get('/', controller.show.bind(controller), responseHandler);
router.put('/', controller.update.bind(controller), responseHandler);

router.post('/cards', controller.saveCard.bind(controller), responseHandler);
router.get('/cards', controller.getCards.bind(controller), responseHandler);
router.delete('/cards/:card_id', controller.removeCard.bind(controller), responseHandler);
router.post('/charge', controller.charge.bind(controller), responseHandler);

router.use('/requests', addUserFilter(), requestRouter);
router.use('/shops', addUserFilter(), shopRouter);
router.use('/trips', addUserFilter(), tripRouter);

// router.put('/unlink/:provider', controller.unlink.bind(controller));

module.exports = router;
