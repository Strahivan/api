const Model = require('objection').Model;
const schema = require('./category.schema.json');

class Category extends Model {
  static get tableName() {
    return 'category';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'category.parent_id',
          to: 'category.id',
        },
      },
    };
  }
}

module.exports = Category;

