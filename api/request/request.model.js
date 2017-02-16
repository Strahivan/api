const path = require('path');
const Model = require('objection').Model;
const schema = require('./request.schema.json');

class Request extends Model {
  static get tableName() {
    return 'request';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      source: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'request.source_id',
          to: 'country.id',
        },
      },
      destination: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'request.destination_id',
          to: 'country.id',
        },
      },
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../user/user.model`),
        join: {
          from: 'request.customer_id',
          to: 'user.id',
        },
      },
      trip: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../trip/trip.model`),
        join: {
          from: 'request.trip_id',
          to: 'trip.id',
        },
      },
    };
  }
}

module.exports = Request;
