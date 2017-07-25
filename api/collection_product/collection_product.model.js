const Base = require('../base/base.model');
const path = require('path');
const schema = require('./collection_product.schema.json');
const Product = require('../product/product.model');

class CollectionProduct extends Base {
  static get tableName() {
    return 'collection_product';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      collection: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../collection/collection.model`),
        join: {
          from: 'collection_product.collection_id',
          to: 'collection.id'
        }
      },
      product: {
        relation: Base.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'collection_product.product_id',
          to: 'product.id'
        }
      }
    };
  }
}

module.exports = CollectionProduct;

