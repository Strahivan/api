const Shop = require('../shop/shop.model');
const Product = require('../product/product.model');
const mailQueue = require('../../config/queue').mailQueue;
const config = require('../../config/environment');
const Request = require('./request.model');

async function notifyOrderCreated(req, res, next) {
  try {
    const recipients = [];
    const product = await Product.query()
      .findById(res.locals.data.product_id);

    const shop = await Shop.query()
      .findById(product.shop_id)
      .eager('[owner]');

    recipients.push(shop.owner.email);
    recipients.push(config.mail.sales);

    await mailQueue.add({
      from: `Novelship <${config.mail.notify}>`,
      to: recipients,
      template: 'new-order',
      context: {
        store_url: `${config.webappUrl}/user/shops/${shop.id}`,
        order_url: `${config.webappUrl}/user/shops/${shop.id}/requests/${res.locals.data.id}`,
        product_url: `${config.webappUrl}/products/${res.locals.data.product_id}`,
        product_name: product.name,
        store_name: shop.name
      }
    });
    next();
  } catch (e) {
    /* handle error */
    return next(e);
  }
}

async function notifyOrderChanged(req, res, next) {
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
          order_url: `${config.webappUrl}/user/requests/${req.params.request_id}`,
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

module.exports = { notifyOrderChanged, notifyOrderCreated};
