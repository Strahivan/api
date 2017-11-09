const Shop = require('../shop/shop.model');
const Product = require('../product/product.model');
const mailQueue = require('../../config/queue').mailQueue;
const config = require('../../config/environment');
const Request = require('./request.model');
const statusMap = require('../../components/status-map');
const shopStatusMap = require('../../components/shop-status-map');

async function notifyOrderCreated(req, res, next) {
  try {
    const shop = await Shop.query()
      .findById(res.locals.data.shop_id)
      .eager('[owner]');

    const recipients = [];
    const context = {
      store_url: `${config.webappUrl}/user/shops/${res.locals.data.shop_id}`,
      order_url: `${config.webappUrl}/user/shops/${res.locals.data.shop_id}/requests/${res.locals.data.id}`,
      store_name: shop.name
    };
    recipients.push(shop.owner.email);
    recipients.push(config.mail.sales);

    if (req.body.product_details) {
      Object.assign(context, {
        product_url: res.locals.data.product_details.url,
        product_name: res.locals.data.product_details.name
      });
    } else {
      const product = await Product.query()
        .findById(res.locals.data.product_id);

      Object.assign(context, {
        product_url: `${config.webappUrl}/products/${res.locals.data.product_id}`,
        product_name: product.name
      });
    }

    await mailQueue.add({
      from: `Novelship <${config.mail.notify}>`,
      to: recipients,
      template: 'new-order',
      context: context
    });

    return next();
  } catch (e) {
    /* handle error */
    return next(e);
  }
}

async function sendUpdateToShopOwner(req, order) {
  const shop = await Shop.query()
    .findById(order.shop_id)
    .eager('[owner]');

  const email = shop.owner.email;
  const template = 'shop-order-status';
  const status = shopStatusMap[req.body.status];

  return mailQueue.add({
    from: `Novelship <${config.mail.notify}>`,
    to: email,
    template: template,
    context: {
      webappUrl: config.webappUrl,
      order: order,
      shop: shop,
      product: order.product || order.product_details,
      status: status
    }
  });
}

async function notifyOrderChanged(req, res, next) {
  if (req.body.status) {
    try {
      const order = await Request.query()
        .findById(req.params.request_id)
        .eager('[customer, product]');

      const email = order.customer.email;
      const template = 'order-status';
      status = statusMap[req.body.status];

      if (req.body.status === 'verify' || req.body.status === 'pending' || req.body.status === 'verify_pending_payment' || req.body.status === 'ready_for_delivery') {
        await sendUpdateToShopOwner(req, order);
      }

      await mailQueue.add({
        from: `Novelship <${config.mail.notify}>`,
        to: email,
        template: template,
        context: {
          webappUrl: config.webappUrl,
          order: order,
          product: order.product || order.product_details,
          status: status
        }
      });

      return next();
    } catch (e) {
      return next(e);
    }
  }
  return next();
}

module.exports = { notifyOrderChanged, notifyOrderCreated };
