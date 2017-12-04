const moment = require('moment');
const jwt = require('jwt-simple');
const config = require('../config/environment');
const User = require('../api/user/user.model');
const randomstring = require('randomstring');

function createJWT(user) {
  const payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };

  return jwt.encode(payload, config.token);
}

async function getReferralCode() {
  const referralCode = randomstring.generate({
    length: 6,
    charset: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefgijkmnpqrstuvwxyz23456789'
  });

  const user = await User.query()
    .where({ referral_code: referralCode});

  if (user.length === 0) {
    return referralCode;
  }
  return getReferralCode();
}

module.exports = {createJWT, getReferralCode};
