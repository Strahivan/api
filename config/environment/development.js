const config = {
  test: {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD
  },
  paypal: {
    base: 'https://api.sandbox.paypal.com/v1',
    client: process.env.PAYPAL_CLIENT,
    secret: process.env.PAYPAL_SECRET
  },
  host: 'http://localhost',
  port: '3000',
  webappUrl: 'http://localhost:9000'
};

module.exports = config;
