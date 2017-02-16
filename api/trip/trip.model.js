const path = require('path');
const Model = require('objection').Model;
const schema = require('./trip.schema.json');

class Trip extends Model {
  static get tableName() {
    return 'trip';
  }

  static get jsonSchema() {
    return schema;
  }

  static getRelationMappings() {
    return {
      traveler: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../user/user.model`),
        join: {
          from: 'trip.traveler_id',
          to: 'user.id',
        },
      },
      origin: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'trip.origin_id',
          to: 'country.id',
        },
      },
      destination: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'trip.destination_id',
          to: 'country.id',
        },
      },
    };
  }
}

module.exports = Trip;
