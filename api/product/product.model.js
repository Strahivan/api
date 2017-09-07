const path = require('path');
const Base = require('../base/base.model');
const schema = require('./product.schema.json');

class Product extends Base {
  static get tableName() {
    return 'product';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      category: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../category/category.model`),
        join: {
          from: 'product.category_id',
          to: 'category.id'
        }
      },
      shop: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../shop/shop.model`),
        join: {
          from: 'product.shop_id',
          to: 'shop.id'
        }
      },
      brand: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../brand/brand.model`),
        join: {
          from: 'product.brand_id',
          to: 'brand.id'
        }
      },
      source: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'product.source_id',
          to: 'country.id'
        }
      },
      collections: {
        relation: Base.ManyToManyRelation,
        modelClass: path.normalize(`${__dirname}/../collection/collection.model`),
        join: {
          from: 'product.id',
          through: {
            modelClass: path.normalize(`${__dirname}/../collection_product/collection_product.model`),
            from: 'collection_product.product_id',
            to: 'collection_product.collection_id'
          },
          to: 'collection.id'
        }
      }
    };
  }
}

module.exports = Product;

