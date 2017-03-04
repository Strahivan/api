const QueryBuilder = require('objection').QueryBuilder;
const Model = require('objection').Model;

class BaseQueryBuilder extends QueryBuilder {
  customOrderBy(queryObject) {
    if (queryObject.sort.by === 'location' && queryObject.coordinates) {
      queryObject.coordinates = queryObject.coordinates.map(val => parseInt(val, 10));
      return this.orderByRaw(`location <-> 
          ST_SetSRID(ST_MakePoint(${queryObject.coordinates[0]}, ${queryObject.coordinates[1]}),3857)`);
    }
    return this.orderBy(queryObject.sort.by, queryObject.sort.order);
  }
}

class Base extends Model {
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

Base.QueryBuilder = BaseQueryBuilder;

module.exports = Base;
