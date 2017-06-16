const config = {
  test: {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD
  },
  host: 'http://localhost',
  port: '3000',
  webappUrl: 'http://localhost:9000'
};

module.exports = config;
