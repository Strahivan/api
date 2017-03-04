const Base = require('../base/base.model');
const schema = require('./zone.schema.json');

class Zone extends Base {
  static get tableName() {
    return 'zone';
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Zone;
