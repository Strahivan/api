const config = {
  host: 'https://api.novelship.com',
  port: '80',
  paypal: {
    base: 'https://api.paypal.com/v1',
    client: process.env.PAYPAL_CLIENT,
    secret: process.env.PAYPAL_SECRET
  },
  webappUrl: 'https://novelship.com'
};

module.exports = config;

