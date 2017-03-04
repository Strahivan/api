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
          to: 'category.id',
        },
      },
      creator: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../user/user.model`),
        join: {
          from: 'product.creator_id',
          to: 'user.id',
        },
      },
      source: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../country/country.model`),
        join: {
          from: 'product.source_id',
          to: 'country.id',
        },
      },
    };
  }
}

module.exports = Product;

