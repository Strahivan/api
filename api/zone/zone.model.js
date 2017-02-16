const Model = require('objection').Model;
const schema = require('./zone.schema.json');

class Zone extends Model {
  static get tableName() {
    return 'zone';
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Zone;
