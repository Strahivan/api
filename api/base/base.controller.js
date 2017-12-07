const findQuery = require('objection-find');
const _ = require('lodash');
const searchFilter = require('../../components/filters/text-search');

function rejectExtras(properties, params, idKey) {
  let data = Object.assign({}, params);
  // if paramaters has the id key(usually the last param)
  // then replace it's name with id
  if (data[idKey]) {
    const temp = data[idKey];
    delete data[idKey];
    data.id = temp;
  }

  // reject the properties in url params that don't belong to the model
  data = _.pick(data, properties);
  // convert everything to number
  return _.mapValues(data, Number);
}

function filterActive(req, properties) {
  if (!properties.includes('active')) {
    if (req.query && req.query.where && (req.query.where['active:eq'] === 'true' || req.query.where['active:eq'] === 'false')) {
      delete req.query.where['active:eq'];
    }
  }
}

function mapQueryParams(req, map) {
  if (map) {
    // for each value in map, if the value exists in params
    // create a where query (join op) for that to fetch the data from
    // related table
    Object.entries(map).map(entry => {
      if (req.params[entry[0]]) {
        req.query = req.query ? req.query : {};
        req.query.where = req.query.where ? req.query.where : {};
        req.query.where[entry[1]] = req.params[entry[0]];
      }
    });
  }
}

function getUserFilter(req, userKey) {
  if (userKey && req.userSpecific) {
    return { [userKey]: req.user.id };
  }
  return {};
}

class BaseController {
  constructor(model, idKey, userKey, map) {
    this.model = model;
    this.id = idKey;
    this.userKey = userKey;
    this.map = map;
    this.properties = Object.keys(this.model.jsonSchema.properties);
    this.properties.push('id');
  }

  // add middleware to check existence
  // TODO: seperate adding data to request body
  create(req, res, next) {
    const data = Object.assign({}, req.body, rejectExtras(this.properties, req.params, this.id));
    if (this.userKey) data[this.userKey] = req.user.id;
    return this.model.query()
      .insert(data)
      .then(item => {
        res.locals.data = item;
        return next();
      })
      .catch(err => {
        next(err);
      });
  }

  index(req, res, next) {
    const filter = Object.assign({}, getUserFilter(req, this.userKey), rejectExtras(this.properties, req.params, this.id));
    mapQueryParams(req, this.map);
    filterActive(req, this.properties);
    return findQuery(this.model)
      .registerFilter('search', searchFilter)
      .build(req.query.where)
      .skipUndefined()
      .where(filter)
      .column(req.query.fields)
      .eager(req.query.include)
      .orderBy(req.query.sort.by, req.query.sort.order)
      .page(req.query.page.number, req.query.page.size)
      .then(items => {
        res.locals.data = items;
        return next();
      })
      .catch(err => next(err));
  }

  show(req, res, next) {
    const filter = Object.assign({}, getUserFilter(req, this.userKey), rejectExtras(this.properties, req.params, this.id));
    filterActive(req, this.properties);
    return this.model.query()
      .skipUndefined()
      .where(filter)
      .first()
      .eager(req.query.include)
      .then((item) => {
        if (!item) {
          res.locals.status = 404;
          return next(new Error('not found'));
        }
        res.locals.data = item;
        return next();
      })
    .catch(err => next(err));
  }

  update(req, res, next) {
    const filter = Object.assign({}, getUserFilter(req, this.userKey), rejectExtras(this.properties, req.params, this.id));
    return this.model.query()
      .skipUndefined()
      .patch(req.body)
      .where(filter)
      .then(affected => next())
      .catch(err => next(err));
  }

  delete(req, res, next) {
    const filter = Object.assign({}, getUserFilter(req, this.userKey), rejectExtras(this.properties, req.params, this.id));
    return this.model.query()
      .skipUndefined()
      .where(filter)
      .delete()
      .then(() => {
        res.locals.status = 200;
        return next();
      })
      .catch(err => next(err));
  }

  destroy(req, res, next) {
    const filter = Object.assign({}, getUserFilter(req, this.userKey), rejectExtras(this.properties, req.params, this.id));
    return this.model.query()
      .skipUndefined()
      .patch({ active: false })
      .where(filter)
      .then(() => {
        res.locals.status = 200;
        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = BaseController;
