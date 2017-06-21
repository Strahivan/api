const Country = require('../country/country.model');

async function calculatePrice(req, res, next) {
  try {
    const country = await Country.query()
      .findById(req.body.source_id);
    req.body.price = req.body.cost + (req.body.cost * 0.15) + (req.body.cost * 0.07) + (req.body.weight * country.ems_fee) + (req.body.local_delivery_fee || 0) + (req.body.price_override || 0);
    next();
  } catch (e) {
    return next(e);
  }
}

module.exports = { calculatePrice };

