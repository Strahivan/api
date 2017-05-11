const User = require('../user/user.model');
const utilities = require('../../components/utilities');
const stripe = require('stripe')(process.env.STRIPE_KEY);

class MeController {
  constructor() {
    this.model = User;
    this.currencyMultiplierMap = {
      sgd: 100,
      yen: 1
    };
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

  update(req, res) {
    return this.model
      .query()
      .patch(req.body)
      .where({ id: req.user.id })
      .omit('hash')
      .then((user) => {
        if (!user) return utilities.throwNotFound(res);
        return utilities.responseHandler(null, res, 200);
      })
      .catch(err => utilities.responseHandler(err, res));
  }

  saveCard(req, res) {
    // create customer if there's no customer
    // else create a new source on current customer
    if (!req.user.stripe_token) {
      stripe.customers.create({
        description: req.user.name,
        email: req.user.email,
        source: req.body.token.id,
        currency: req.user.currency
      })
      .then((response) => {
        return this.model
          .query()
          .findById(req.user.id)
          .patch({ stripe_token: response.id });
      })
      .then(response => utilities.responseHandler(null, res, 200, response))
      .catch(err => utilities.responseHandler(err, res));
    } else {
      stripe.customers.createSource(req.user.stripe_token, {
        source: req.body.token.id
      })
      .then(response => utilities.responseHandler(null, res, 200, response))
      .catch(err => utilities.responseHandler(err, res));
    }
  }

  getCards(req, res) {
    stripe.customers.listCards(req.user.stripe_token)
      .then(cards => utilities.responseHandler(null, res, 200, cards))
      .catch(err => utilities.responseHandler(err, res));
  }

  removeCard(req, res) {
    stripe.customers.deleteCard(req.user.stripe_token, req.params.card_id)
      .then(cards => utilities.responseHandler(null, res, 200, cards))
      .catch(err => utilities.responseHandler(err, res));
  }

  charge(req, res) {
    const amount = Number(req.body.amount) * this.currencyMultiplierMap[req.body.currency.toLowerCase()];
    stripe.charges.create({
      amount,
      source: req.body.source,
      currency: req.body.currency,
      customer: req.user.stripe_token
    })
    .then(charge => utilities.responseHandler(null, res, 200, charge))
    .catch((err) => {
      console.log(err);
      return utilities.responseHandler(err, res);
    });
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

