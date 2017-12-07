require('dotenv').config();
const User = require('../api/user/user.model');
const authUtils = require('../auth/authutils');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV]);

User.knex(knex);

User.query()
  .then(users => {
    Promise.all(users.map(async (user) => {
      return user.$query()
        .patch({referral_code: await authUtils.getReferralCode()});
    }))
      .then(success => {
        console.log('generated referral code for all users');
        process.exit(0);
      })
      .catch(err => {
        console.log(err);
        process.exit(1);
      });
  });

