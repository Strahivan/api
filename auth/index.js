const express = require('express');
const facebook = require('./facebook');
const local = require('./auth.controller');
const responseHandler = require('../components/middlewares/respond');

const router = new express.Router();

router.post('/facebook', facebook.authenticate, responseHandler);

router.post('/signup', local.signup, responseHandler);
router.get('/verify', local.verify, responseHandler);
router.post('/login', local.login, responseHandler);
router.post('/request-reset', local.requestReset, responseHandler);
router.post('/reset', local.reset, responseHandler);

module.exports = router;
