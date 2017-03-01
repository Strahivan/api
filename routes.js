const country = require('./api/country');
const request = require('./api/request');
const trip = require('./api/trip');
const user = require('./api/user');
const zone = require('./api/zone');
const product = require('./api/product');
const category = require('./api/category');
const me = require('./api/me');
const auth = require('./auth');
const signedUrl = require('./components/signing');

module.exports = (app) => {
  app.use('/countries', country);
  app.use('/categories', category);
  app.use('/requests', request);
  app.use('/trips', trip);
  app.use('/products', product);
  app.use('/zones', zone);
  app.use('/users', user);
  app.use('/me', me);

  app.get('/upload', signedUrl);
  app.use('/auth', auth);

  app.use((err, req, res, next) => {
    if (err) {
      res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
    } else {
      next();
    }
  });
};
