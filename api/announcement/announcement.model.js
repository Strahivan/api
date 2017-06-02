const Base = require('../base/base.model');
const schema = require('./announcement.schema.json');

class Announcement extends Base {
  static get tableName() {
    return 'announcement';
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Announcement;

