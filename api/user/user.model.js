const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const Model = require('objection').Model;
const schema = require('./user.schema.json');
const path = require('path');

class User extends Model {
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
        relation: Model.HasManyRelation,
        modelClass: path.normalize(`${__dirname}/../trip/trip.model`),
        join: {
          from: 'user.id',
          to: 'trip.traveler_id',
        },
      },
      requests: {
        relation: Model.HasManyRelation,
        modelClass: path.normalize(`${__dirname}/../request/request.model`),
        join: {
          from: 'user.id',
          to: 'request.customer_id',
        },
      },
    };
  }
}

module.exports = User;
