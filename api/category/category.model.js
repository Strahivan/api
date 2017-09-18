const Base = require('../base/base.model');
const schema = require('./category.schema.json');

class Category extends Base {
  static get tableName() {
    return 'category';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      parent: {
        relation: Base.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'category.parent_id',
          to: 'category.id'
        }
      },
      subcategories: {
        relation: Base.HasManyRelation,
        modelClass: Category,
        join: {
          from: 'category.id',
          to: 'category.parent_id'
        }
      }
    };
  }
}

module.exports = Category;

