const path = require('path');
const Base = require('../base/base.model');
const schema = require('./request.schema.json');

class Request extends Base {
  static get tableName() {
    return 'request';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      source: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'request.source_id',
          to: 'country.id'
        }
      },
      destination: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'request.destination_id',
          to: 'country.id'
        }
      },
      batch: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../batch/batch.model`),
        join: {
          from: 'request.source_id',
          to: 'country.id'
        }
      },
      product: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../product/product.model`),
        join: {
          from: 'request.product_id',
          to: 'product.id'
        }
      },
      customer: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../user/user.model`),
        join: {
          from: 'request.customer_id',
          to: 'user.id'
        }
      },
      trip: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../trip/trip.model`),
        join: {
          from: 'request.trip_id',
          to: 'trip.id'
        }
      }
    };
  }
}

module.exports = Request;
