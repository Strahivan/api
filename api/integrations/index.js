const express = require('express');
const authenticate = require('../../components/middlewares/authenticate');
const AftershipController = require('./aftership');
const paypal = require('./paypal');
const responseHandler = require('../../components/middlewares/respond');

const router = new express.Router();
const aftership = new AftershipController();

router.use(authenticate);
router.post('/aftership', aftership.create.bind(AftershipController), responseHandler);

router.post('/paypal/payment', paypal.payment, responseHandler);
router.get('/paypal/execute', paypal.execute, responseHandler);
router.post('/paypal/auth', paypal.getAuthorization, responseHandler);

module.exports = router;

