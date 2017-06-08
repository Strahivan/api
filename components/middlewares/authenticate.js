const jwt = require('jwt-simple');
const config = require('../../config/environment');
const moment = require('moment');
const User = require('../../api/user/user.model');

module.exports = function(req, res, next) {
  if (req.user) {
    return next();
  }

  if (!req.headers.authorization) {
    res.locals.status = 401;
    return next(new Error('no authorization header is present'));
  }
  let payload = null;

  try {
    const token = req.headers.authorization.split(' ')[1];
    payload = jwt.decode(token, config.token);
  } catch (err) {
    return next(err);
  }

  // if token has expired
  if (payload.exp <= moment().unix()) {
    res.locals.status = 401;
    return next(new Error('Token has expired'));
  }

  console.log(payload);
  return User
    .query()
    .findById(payload.sub)
    .then((user) => {
      if (user) {
        req.user = user;
        return next();
      }
      res.locals.status = 404;
      return next(new Error('User not found'));
    });
};

