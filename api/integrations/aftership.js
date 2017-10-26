const request = require('request-promise');
const config = require('../../config/environment');

const base = 'https://api.aftership.com/v4';
const options = {
  method: 'POST',
  headers: {
    'aftership-api-key': config.aftershipKey,
    'Content-Type': 'application/json'
  },
  json: true
};

class AftershipController {

  async create(req, res, next) {
    options.uri = `${base}/trackings`;
    options.body = {tracking: req.body};
    return request(options)
      .then(success => next())
      .catch(err => {
        console.log(err);
        next(err);
      });
  }
}

module.exports = AftershipController;
