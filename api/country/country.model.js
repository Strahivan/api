const Model = require('objection').Model;
const schema = require('./country.schema.json');

class Country extends Model {
  static get tableName() {
    return 'country';
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Country;
