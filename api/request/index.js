const express = require('express');
const processQuery = require('../../components/middlewares/process-query');
const authenticate = require('../../components/middlewares/authenticate');
const responseHandler = require('../../components/middlewares/respond');
const Request = require('./request.model');
const Shop = require('../shop/shop.model');
const BaseController = require('../base/base.controller');
const mailQueue = require('../../config/queue').mailQueue;
const config = require('../../config/environment');

const controller = new BaseController(Request, 'request_id', 'customer_id');

const router = new express.Router({ mergeParams: true });

router.get('/', processQuery, controller.index.bind(controller), responseHandler);
router.get('/:request_id', controller.show.bind(controller), responseHandler);

router.use(authenticate);
router.post('/', controller.create.bind(controller), responseHandler);
router.put('/:request_id', controller.update.bind(controller), notifyUser, responseHandler);
router.patch('/:request_id', controller.update.bind(controller), notifyUser, responseHandler);
router.delete('/:request_id', controller.destroy.bind(controller), responseHandler);

async function notifyUser(req, res, next) {
  if (req.body.status) {
    try {
      const order = await Request.query()
        .findById(req.params.request_id)
        .eager('[customer, product]');

      let email = order.customer.email;
      let template = 'order-status';

      if (req.body.status === 'completed') {
        const shop = await Shop.query()
          .findById(order.product.shop_id)
          .eager('[owner]');

        email = shop.owner.email;
        template = 'order-status';
      }
      await mailQueue.add({
        from: `Novelship <${config.mail.notify}>`,
        to: email,
        template: template,
        context: {
          order_url: `${process.env.WEBAPP_URL}/user/requests/${req.params.request_id}`,
          order_number: order.id,
          status: order.status,
          product_name: order.product.name
        }
      });

      next();
    } catch (e) {
      return next(e);
    }
  }
  return next();
}

module.exports = router;
