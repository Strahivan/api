const path = require('path');
const Base = require('../base/base.model');
const schema = require('./shop.schema.json');

class Shop extends Base {
  static get tableName() {
    return 'shop';
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    return {
      owner: {
        relation: Base.BelongsToOneRelation,
        modelClass: path.normalize(`${__dirname}/../user/user.model`),
        join: {
          from: 'shop.owner_id',
          to: 'user.id'
        }
      }
    };
  }
}

module.exports = Shop;

