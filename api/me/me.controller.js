const User = require('../user/user.model');
const config = require('../../config/environment');
const stripe = require('stripe')(config.stripeKey);

class MeController {
  constructor() {
    this.model = User;
    this.currencyMultiplierMap = {
      sgd: 100,
      yen: 1
    };
  }

  show(req, res, next) {
    return this.model
      .query()
      .eager(req.query.include)
      .skipUndefined()
      .findById(req.user.id)
      .omit(['hash'])
      .then((user) => {
        if (!user) {
          res.locals.status = 404;
          return next(new Error('not found'));
        }
        res.locals.data = user;
        return next();
      })
      .catch(err => next(err));
  }

  update(req, res, next) {
    return this.model
      .query()
      .patch(req.body)
      .where({ id: req.user.id })
      .omit(['hash'])
      .then((user) => {
        if (!user) {
          res.locals.status = 404;
          return next(new Error('not found'));
        }
        return next();
      })
      .catch(err => next(err));
  }

  saveCard(req, res, next) {
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
      .then(response => {
        res.locals.data = response;
        return next();
      })
      .catch(err => next(err));
    } else {
      stripe.customers.createSource(req.user.stripe_token, {
        source: req.body.token.id
      })
      .then(response => {
        res.locals.data = response;
        return next();
      })
      .catch(err => next(err));
    }
  }

  getCards(req, res, next) {
    stripe.customers.listCards(req.user.stripe_token)
      .then(cards => {
        res.locals.data = cards;
        return next();
      })
      .catch(err => next(err));
  }

  removeCard(req, res, next) {
    stripe.customers.deleteCard(req.user.stripe_token, req.params.card_id)
      .then(cards => {
        res.locals.data = cards;
        return next();
      })
      .catch(err => next(err));
  }

  charge(req, res, next) {
    const amount = Number(req.body.amount) * this.currencyMultiplierMap[req.body.currency.toLowerCase()];
    stripe.charges.create({
      amount,
      source: req.body.source,
      currency: req.body.currency,
      customer: req.user.stripe_token
    })
    .then(charge => {
      res.locals.data = charge;
      return next();
    })
    .catch((err) => next(err));
  }

  unlink(req, res, next) {
    const provider = req.query.provider;

    const providers = ['facebook'];
    if (providers.indexOf(provider) === -1) {
      res.locals.status = 404;
      return next(new Error('Unknown provider'));
    }

    return this.model
      .query()
      .findById(req.user.id)
      .update({ [provider]: null })
      .then((user) => {
        res.locals.data = user;
        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = MeController;

