const express = require('express');
const Country = require('./country.model');
const zoneRouter = require('../zone');
const BaseController = require('../base/base.controller');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');

const controller = new BaseController(Country, 'country_id');

const router = new express.Router({ mergeParams: true });
router.use('/:country_id/zones', zoneRouter);

router.get('/', processQuery, controller.index.bind(controller));
router.get('/:country_id', controller.show.bind(controller));

router.use(authenticate);
router.post('/', controller.create.bind(controller));
router.put('/:country_id', controller.update.bind(controller));
router.patch('/:country_id', controller.update.bind(controller));
router.delete('/:country_id', controller.destroy.bind(controller));

module.exports = router;
