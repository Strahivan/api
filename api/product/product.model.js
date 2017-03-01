const path = require('path');
const Model = require('objection').Model;
const schema = require('./product.schema.json');

class Product extends Model {
  static get tableName() {
    return 'product';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../category/category.model`),
        join: {
          from: 'product.category_id',
          to: 'category.id',
        },
      },
      source: {
        relation: Model.BelongsToOneRelation,
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

