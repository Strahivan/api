const country = require('./api/country');
const request = require('./api/request');
const user = require('./api/user');
const zone = require('./api/zone');
const shop = require('./api/shop');
const brand = require('./api/brand');
const batch = require('./api/batch');
const product = require('./api/product');
const category = require('./api/category');
const collection = require('./api/collection');
const announcement = require('./api/announcement');
const me = require('./api/me');
const auth = require('./auth');
const integrations = require('./api/integrations');
const signedUrl = require('./components/signing');
const responseHandler = require('./components/middlewares/respond');

module.exports = (app) => {
  app.use('/announcements', announcement);
  app.use('/countries', country);
  app.use('/categories', category);
  app.use('/collections', collection);
  app.use('/requests', request);
  app.use('/products', product);
  app.use('/shops', shop);
  app.use('/brands', brand);
  app.use('/batches', batch);
  app.use('/zones', zone);
  app.use('/users', user);
  app.use('/me', me);
  app.use('/integrations', integrations);

  app.get('/upload', signedUrl, responseHandler);
  app.use('/auth', auth);

  app.use((err, req, res, next) => {
    console.log(req.user && req.user.email);
    console.log(err);
    if (err) {
      const status = res.locals.status || err.statusCode || err.status || 400;
      return res.status(status).send({message: err.message});
    }
    return next();
  });
};
