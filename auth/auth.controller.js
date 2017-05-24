const User = require('../api/user/user.model');
const authUtils = require('./authutils');
const utilities = require('../components/utilities');
const config = require('../config/environment');
const redis = require('../config/redis');
const uuid = require('uuid');

function getVerificationContent(registrationId) {
  const verificationUrl = `https://${config.host}/auth/verify?token=${registrationId}`;
  return `<a href=${verificationUrl}>Click here to verify</a>`;
}

async function signup(req, res, next) {
  // TODO: validate username, password and email
  // decorator for validation
  if (!(req.body.email || req.body.password)) {
    return next(new Error('must provide email and password'));
  }

  try {
    const registrationId = uuid.v4();
    const user = await User
      .query()
      .where('email', req.body.email);
    if (user.length) {
      res.locals.status = 409;
      return next(new Error('a user with that email already exists'));
    }

    const hash = await User.encryptPassword(req.body.password);
    const userInfo = {
      hash,
      email: req.body.email
    };

    await redis.hmsetAsync(registrationId, userInfo);
    redis.expire(registrationId, 2 * 24 * 60 * 60);

    // create a mail sending task
    await utilities.sendMail(req.body.email,
        [config.mail.registration],
        'Verify',
        getVerificationContent(registrationId));
    return next();
  } catch (err) {
    return next(err);
  }
}


async function login(req, res, next) {
  try {
    const user = await User.query()
      .where({ email: req.body.email })
      .first();

    if (user) {
      const passwordMatch = await user.authenticate(req.body.password);
      if (passwordMatch) {
        res.locals.data = {token: authUtils.createJWT(user)};
        return next();
      }
      res.locals.status = 422;
      return next(new Error('wrong username or password'));
    }
    res.locals.status = 422;
    return next(new Error('wrong username or password'));
  } catch (e) {
    return next(err);
  }
}

async function verify(req, res, next) {
  try {
    const userInfo = await redis.hgetallAsync(req.query.token);

    if (!userInfo) {
      return next(new Error('the link has expired'));
    }
    redis.del(req.query.token);

    await User.query()
      .insert(userInfo);

    return res.redirect('https://novelship.com/auth/login');
  } catch (e) {
    return next(err);
  }
}

function getResetContent(resetId) {
  const verificationUrl = `https://${config.host}/auth/verify?token=${resetId}`;
  return `<a href=${verificationUrl}>Click here to reset</a>`;
}

async function requestReset(req, res, next) {
  try {
    const user = await User.query()
      .where({ email: req.body.email })
      .first();
    if (!user) {
      res.locals.status = 404;
      return next(new Error('no such user exists'));
    }
    const resetId = uuid.v4();
    await redis.setAsync(resetId, user.id);
    redis.expire(resetId, 2 * 24 * 60 * 60);
    await utilities.sendMail(req.body.email,
        [config.mail.support],
        'Password Reset',
        getResetContent(resetId));
    return next();
  } catch (e) {
    return next(err);
  }
}

async function reset(req, res, next) {
  try {
    const hash = await User.encryptPassword(req.body.password);
    const userId = await redis.get(req.body.token);
    redis.del(req.body.token);

    await User.query()
      .patchAndFetchById(Number(userId), { hash });

    return res.redirect('https://novelship.com/auth/login');
  } catch (e) {
    return next(err);
  }
}

module.exports = { signup, reset, requestReset, verify, login };
