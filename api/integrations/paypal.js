const config = require('../../config/environment');
const request = require('request-promise');
const Request = require('../request/request.model');
const Product = require('../product/product.model');

function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}


async function getAmount(req) {
  if (req.product_details) return req.total_price;

  const product = await Product.query().findById(req.product_id);

  return decimalAdjust('ceil', req.count * (product.price - (product.discount || 0)), -1);
}

function getAuthorization(req, res, next) {
  const options = {
    method: 'POST',
    uri: `${config.paypal.base}/oauth2/token`,
    auth: {
      user: config.paypal.client,
      pass: config.paypal.secret
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  return request(options);
}

async function payment(req, res, next) {
  try {
    const paymentData = {
      intent: req.body.intent,
      redirect_urls: req.body.urls,
      payer: {
        payment_method: req.body.payment_method
      },
      transactions: [{
        amount: {
          total: (req.body.request.total_price).toFixed(2),
          currency: req.body.request.currency || 'SGD'
        }
      }]
    };

    const options = {
      method: 'POST',
      uri: `${config.paypal.base}/payments/payment`,
      headers: {
        Authorization: `Bearer ${config.paypal.accessToken}`,
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: paymentData,
      json: true
    };

    const data = await request(options);
    res.locals.data = data;

    return next();
  } catch (e) {
    if (e.statusCode === 401) {
      return await errorHandler(e, req, payment.bind(this, req, res, next), next);
    }
    return next(e);
  }
}

async function execute(req, res, next) {
  try {
    const options = {
      method: 'POST',
      uri: `${config.paypal.base}/payments/payment/${req.query.payment_id}/execute`,
      headers: {
        Authorization: `Bearer ${config.paypal.accessToken}`,
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: {payer_id: req.query.payer_id},
      json: true
    };

    const data = await request(options);
    res.locals.data = data;

    return next();
  } catch (e) {
    if (e.statusCode === 401) {
      return await errorHandler(e, req, execute.bind(this, req, res, next), next);
    }
    return next(e);
  }
}

async function errorHandler(error, req, func, next) {
  try {
    if (req.retry) {
      return next(error);
    }
    req.retry = true;
    paypalAuth = await getAuthorization();
    config.paypal.accessToken = paypalAuth.access_token;
    return func();
  } catch (authErr) {
    return next(authErr);
  }
}

async function capture(req, res, next) {
  try {
    const order = await Request.query().findById(req.params.request_id);
    const options = {
      method: 'POST',
      uri: `${config.paypal.base}/payments/authorization/${order.authorization_id}/capture`,
      headers: {
        Authorization: `Bearer ${config.paypal.accessToken}`,
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        amount: {
          total: (order.total_price).toFixed(2),
          currency: order.currency || 'SGD'
        },
        is_final_capture: true
      },
      json: true
    };

    const data = await request(options);
    await order.$query().patch({captured: true});
    res.locals.data = data;
    return next();
  } catch (e) {
    if (e.statusCode === 401) {
      return await errorHandler(e, req, capture.bind(this, req, res, next), next);
    }
    return next(e);
  }
}

async function voidAuth(req, res, next) {
  try {
    const order = await Request.query().findById(req.params.request_id);
    const options = {
      method: 'POST',
      uri: `${config.paypal.base}/payments/authorization/${order.authorization_id}/void`,
      headers: {
        Authorization: `Bearer ${config.paypal.accessToken}`,
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: {},
      json: true
    };

    const data = await request(options);
    await order.$query().patch({refunded: true, captured: false});
    res.locals.data = data;
    return next();
  } catch (e) {
    if (e.statusCode === 401) {
      return await errorHandler(e, req, voidAuth.bind(this, req, res, next), next);
    }
    return next(e);
  }
}

module.exports = {capture, execute, payment, getAuthorization, voidAuth};
