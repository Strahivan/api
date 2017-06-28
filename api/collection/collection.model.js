const Base = require('../base/base.model');
const User = require('../user/user.model');
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
      }
    };
  }
}

module.exports = Collection;
