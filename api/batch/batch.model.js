const Base = require('../base/base.model');
const Country = require('../country/country.model');
const Shop = require('../shop/shop.model');
const schema = require('./batch.schema.json');

class Batch extends Base {
  static get tableName() {
    return 'batch';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      source: {
        relation: Base.BelongsToOneRelation,
        modelClass: Country,
        join: {
          from: 'batch.source_id',
          to: 'country.id'
        }
      },
      destination: {
        relation: Base.BelongsToOneRelation,
        modelClass: Country,
        join: {
          from: 'batch.destination_id',
          to: 'country.id'
        }
      },
      shop: {
        relation: Base.BelongsToOneRelation,
        modelClass: Shop,
        join: {
          from: 'batch.shop_id',
          to: 'shop.id'
        }
      }
    };
  }
}

module.exports = Batch;

