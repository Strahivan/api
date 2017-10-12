const request = require('request-promise');
const Shop = require('../api/shop/shop.model');
const config = require('../config/environment');

exports.authenticate = function(req, res, next) {
  const options = {
    method: 'POST',
    uri: 'https://connect.stripe.com/oauth/token',
    body: {
      code: req.query.code,
      grant_type: 'authorization_code',
      client_id: config.stripeClientId,
      client_secret: config.stripeKey
    },
    json: true // Automatically stringifies the body to JSON
  };

  request(options)
    .then(result => {
      Shop.query()
        .patchAndFetchById(req.query.state, {shop_stripe_id: result.stripe_user_id})
        .then(item => {
          res.locals.data = item;
          return next();
        })
        .catch(err => next(err));
    });
};
