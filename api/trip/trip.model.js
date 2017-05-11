const path = require('path');
const Base = require('../base/base.model');
const schema = require('./trip.schema.json');

class Trip extends Base {
  static get tableName() {
    return 'trip';
  }

  static get jsonSchema() {
    return schema;
  }

  static getRelationMappings() {
    return {
      traveler: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../user/user.model`),
        join: {
          from: 'trip.traveler_id',
          to: 'user.id'
        }
      },
      origin: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'trip.origin_id',
          to: 'country.id'
        }
      },
      destination: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'trip.destination_id',
          to: 'country.id'
        }
      }
    };
  }
}

module.exports = Trip;
