const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const User = require('./user.model');
const BaseController = require('../base/base.controller');

const router = new express.Router({ mergeParams: true });
const controller = new BaseController(User, 'user_id');

router.use(authenticate);

router.get('/me', controller.show.bind(controller));
router.get('/', processQuery, controller.index.bind(controller));
router.put('/:user_id', controller.update.bind(controller));
router.patch('/:user_id', controller.update.bind(controller));
router.delete('/:user_id', controller.destroy.bind(controller));
// router.post('/unlink', controller.unlink.bind(controller));

module.exports = router;
