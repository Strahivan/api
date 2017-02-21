const request = require('request-promise');
const User = require('../api/user/user.model');
const config = require('../config/environment');
const authUtils = require('./authutils');

function createUser(res, profile) {
  return User.query()
    .insert({ name: profile.name, facebook: profile.id, email: profile.email })
    .then(user => res.send({ token: authUtils.createJWT(user) }))
    .catch(error => error);
}

exports.authenticate = function (req, res) {
  const query = Object.assign({}, req.body, { fields: 'email,name' });
  return request.get({
    url: config.facebook.profile,
    qs: query,
    json: true,
  }, (fberr, fbres, profile) => {
    if (fberr) {
      res.status(400).send({
        message: fberr,
      });
    }

    User.query()
      .where('facebook', profile.id)
      .then((user) => {
        if (user.length) {
          return res.status(200).send({ token: authUtils.createJWT(user[0]) });
        }
        return createUser(res, profile);
      })
      .catch(err => res.status(500).send(err));
  });
};

