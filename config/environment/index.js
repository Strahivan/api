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
  redis: process.env.REDIS_URL,
  stripeKey: process.env.STRIPE_KEY,
  mail: {
    smtp: process.env.SMTP_CONNECTION,
    registration: 'verify@novelship.com',
    support: 'support@novelship.com',
    notify: 'notify@novelship.com',
    sales: 'sales@novelship.com'
  }
};
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
