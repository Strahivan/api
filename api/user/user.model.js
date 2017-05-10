const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const Base = require('../base/base.model');
const schema = require('./user.schema.json');
const path = require('path');

class User extends Base {
  static get tableName() {
    return 'user';
  }

  static get jsonSchema() {
    return schema;
  }

  /* Actions */
  authenticate(plainText) {
    return bcrypt.compareAsync(plainText, this.hash);
  }

  static encryptPassword(password, saltRounds = 10) {
    return bcrypt.hashAsync(password, saltRounds);
  }

  static get relationMappings() {
    return {
      trips: {
        relation: Base.HasManyRelation,
        modelClass: path.normalize(`${__dirname}/../trip/trip.model`),
        join: {
          from: 'user.id',
          to: 'trip.traveler_id',
        },
      },
      requests: {
        relation: Base.HasManyRelation,
        modelClass: path.normalize(`${__dirname}/../request/request.model`),
        join: {
          from: 'user.id',
          to: 'request.customer_id',
        },
      },
      country: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'user.country_id',
          to: 'country.id',
        },
      },
      shops: {
        relation: Base.HasManyRelation,
        modelClass: path.normalize(`${__dirname}/../shop/shop.model`),
        join: {
          from: 'user.id',
          to: 'shop.owner_id',
        },
      },
    };
  }
}

module.exports = User;
