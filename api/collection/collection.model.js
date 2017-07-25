const Base = require('../base/base.model');
const User = require('../user/user.model');
const Product = require('../product/product.model');
const CollectionProduct = require('../collection_product/collection_product.model');
const schema = require('./collection.schema.json');

class Collection extends Base {
  static get tableName() {
    return 'collection';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      creator: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'collection.creator_id',
          to: 'user.id'
        }
      },
      products: {
        relation: Base.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'collection.id',
          through: {
            modelClass: CollectionProduct,
            from: 'collection_product.collection_id',
            to: 'collection_product.product_id'
          },
          to: 'product.id'
        }
      }
    };
  }
}

module.exports = Collection;
