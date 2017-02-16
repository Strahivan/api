const express = require('express');
const zone = require('./zone.model');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');

const controller = new BaseController(zone, 'zone_id');

const router = new express.Router({ mergeParams: true });

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:zone_id', controller.show.bind(controller));

router.use(authenticate);
router.post('/', controller.create.bind(controller));
router.put('/:zone_id', controller.update.bind(controller));
router.patch('/:zone_id', controller.update.bind(controller));
router.delete('/:zone_id', controller.destroy.bind(controller));

module.exports = router;
