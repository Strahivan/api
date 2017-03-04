const Base = require('../base/base.model');
const schema = require('./country.schema.json');

class Country extends Base {
  static get tableName() {
    return 'country';
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Country;
