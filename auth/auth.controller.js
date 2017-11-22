const User = require('../api/user/user.model');
const authUtils = require('./authutils');
const mailQueue = require('../config/queue').mailQueue;
const config = require('../config/environment');
const redis = require('../config/redis');
const uuid = require('uuid');

function getVerificationUrl(registrationId) {
  return `${config.host}/auth/verify?token=${registrationId}`;
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
      .where('email', req.body.email.toLowerCase());
    if (user.length) {
      res.locals.status = 409;
      return next(new Error('a user with that email already exists'));
    }

    const hash = await User.encryptPassword(req.body.password);
    const userInfo = {
      hash,
      email: req.body.email.toLowerCase()
    };

    await redis.hmsetAsync(registrationId, userInfo);
    redis.expire(registrationId, 2 * 24 * 60 * 60);

    // create a mail sending task
    await mailQueue.add({
      from: `Novelship <${config.mail.registration}>`,
      to: req.body.email.toLowerCase(),
      template: 'signup',
      context: {
        verification_url: getVerificationUrl(registrationId)
      }
    });
    return next();
  } catch (err) {
    return next(err);
  }
}


async function login(req, res, next) {
  try {
    const user = await User.query()
      .where({ email: req.body.email.toLowerCase() })
      .first();

    if (user) {
      const passwordMatch = await user.authenticate(req.body.password);
      if (passwordMatch) {
        res.locals.data = {token: authUtils.createJWT(user)};
        return next();
      }
    }
    res.locals.status = 422;
    return next(new Error('wrong username or password'));
  } catch (e) {
    return next(e);
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
  return `${config.webappUrl}/auth/new-password?token=${resetId}`;
}

async function requestReset(req, res, next) {
  try {
    const user = await User.query()
      .where({ email: req.body.email.toLowerCase() })
      .first();
    if (!user) {
      res.locals.status = 404;
      return next(new Error('no such user exists'));
    }
    const resetId = uuid.v4();
    await redis.setAsync(resetId, user.id);
    redis.expire(resetId, 2 * 24 * 60 * 60);
    await mailQueue.add({
      from: `Novelship <${config.mail.support}>`,
      to: req.body.email.toLowerCase(),
      template: 'reset',
      context: {
        reset_url: getResetContent(resetId)
      }
    });
    return next();
  } catch (err) {
    return next(err);
  }
}

async function reset(req, res, next) {
  try {
    const hash = await User.encryptPassword(req.body.password);
    const userId = await redis.getAsync(req.body.token);
    redis.del(req.body.token);

    await User.query()
      .patchAndFetchById(Number(userId), { hash });

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { signup, reset, requestReset, verify, login };
