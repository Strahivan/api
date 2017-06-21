const Country = require('../country/country.model');

function calculateMargin(cost, tiers) {
  const marginSpread = tiers.map(tier => {
    const rate = tier.rate / 100;
    if (cost > tier.min && cost < tier.max) {
      // if it's greater than min but less than max
      return Math.abs(cost - tier.max) * rate;
    } else if (cost <= tier.min) {
      // if the product is lower than the price bracket
      return 0;
    } else if (tier.max === undefined) {
      // if highest tier has been reached
      return (cost - tier.min) * rate;
    }
    // by default, return the rate for the specific tier
    return (tier.max - tier.min) * rate;
  });

  return marginSpread.reduce((sum, current) => {
    return sum + current;
  }, 0);
}

async function calculatePrice(req, res, next) {
  try {
    const country = await Country.query()
      .findById(req.body.source_id);
    req.body.price = req.body.cost + calculateMargin(req.body.cost, country.tiers) + (req.body.cost * 0.07) + (req.body.weight * country.ems_fee) + (req.body.local_delivery_fee || 0) + (req.body.price_override || 0);
    next();
  } catch (e) {
    return next(e);
  }
}

module.exports = { calculatePrice };

