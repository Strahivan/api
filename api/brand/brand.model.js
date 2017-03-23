const Base = require('../base/base.model');
const schema = require('./brand.schema.json');

class Brand extends Base {
  static get tableName() {
    return 'brand';
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Brand;

