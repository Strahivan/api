const User = require('../user/user.model');
const utilities = require('../../components/utilities');

class MeController {
  constructor() {
    this.model = User;
  }

  show(req, res) {
    return this.model
      .query()
      .eager(req.query.include)
      .skipUndefined()
      .findById(req.user.id)
      .omit('hash')
      .then((user) => {
        if (!user) return utilities.throwNotFound(res);
        return utilities.responseHandler(null, res, 200, user);
      })
      .catch(err => utilities.responseHandler(err, res));
  }

  put(req, res) {
    return this.model
      .query()
      .patch(req.body)
      .where({ id: req.user.id })
      .omit('hash')
      .then((user) => {
        if (!user) return utilities.throwNotFound(res);
        return utilities.responseHandler(null, res, 200, user);
      })
      .catch(err => utilities.responseHandler(err, res));
  }

  unlink(req, res) {
    const provider = req.query.provider;

    const providers = ['facebook'];
    if (providers.indexOf(provider) === -1) {
      return res.status(404).send('Unknown provider');
    }

    return this.model
      .query()
      .findById(req.user.id)
      .update({ [provider]: null })
      .then((user) => {
        res.status(200).send(user);
      })
      .catch(err => utilities.responseHandler(err, res));
  }
}

module.exports = MeController;

