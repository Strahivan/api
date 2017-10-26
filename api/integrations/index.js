const express = require('express');
const authenticate = require('../../components/middlewares/authenticate');
const AftershipController = require('./aftership');
const responseHandler = require('../../components/middlewares/respond');

const router = new express.Router();
const aftership = new AftershipController();

router.use(authenticate);
router.post('/aftership', aftership.create.bind(AftershipController), responseHandler);

module.exports = router;

