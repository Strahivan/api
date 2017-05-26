const _ = require('lodash');

const all = {
  aws: {
    access: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET,
    region: process.env.AWS_REGION
  },
  facebook: {
    profile: 'https://graph.facebook.com/v2.8/me'
  },
  token: process.env.TOKEN_SECRET,
  host: process.env.HOST,
  port: process.env.PORT,
  redis: process.env.REDIS_URL,
  mail: {
    smtp: process.env.SMTP_CONNECTION,
    registration: process.env.REGISTRATION_EMAIL,
    support: process.env.SUPPORT_EMAIL,
    notify: process.env.NOTIFICATION_EMAIL
  }
};
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
