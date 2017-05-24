const request = require('request-promise');
const User = require('../api/user/user.model');
const config = require('../config/environment');
const authUtils = require('./authutils');

function createUser(res, profile) {
  return User.query()
    .insert({ name: profile.name, facebook: profile.id, email: profile.email })
    .then(user => {
      res.locals.data = { token: authUtils.createJWT(user) };
      return next();
    })
    .catch(error => next(error));
}

exports.authenticate = function(req, res, next) {
  const query = Object.assign({}, req.body, { fields: 'email,name' });
  return request.get({
    url: config.facebook.profile,
    qs: query,
    json: true
  }, (fberr, fbres, profile) => {
    if (fberr) {
      return next(fberr);
    }

    User.query()
      .where('facebook', profile.id)
      .then((user) => {
        if (user.length) {
          res.locals.data = {token: authUtils.createJWT(user[0])};
          return next();
        }
        return createUser(res, profile, next);
      })
      .catch(err => next(err));
  });
};

