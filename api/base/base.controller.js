const findQuery = require('objection-find');
const _ = require('lodash');
const searchFilter = require('../../components/filters/text-search');

function rejectExtras(properties, params, idKey) {
  let data = Object.assign({}, params);
  if (data[idKey]) {
    const temp = data[idKey];
    delete data[idKey];
    data.id = temp;
  }
  data = _.pick(data, properties);
  return _.mapValues(data, Number);
}

function getFilter(req, idKey, properties, userKey) {
  let filter;
  if (userKey && req.userSpecific) {
    filter = { [userKey]: req.user.id };
  }
  return Object.assign({}, filter, rejectExtras(properties, req.params, idKey));
}


class BaseController {
  constructor(model, idKey, userKey) {
    this.model = model;
    this.id = idKey;
    this.userKey = userKey;
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
    const filter = getFilter(req, this.id, this.properties, this.userKey);
    console.log('#######################');
    console.log(req.query.where);
    console.log('#######################');
    console.log(filter);
    console.log('#######################');
    console.log(searchFilter);
    return findQuery(this.model)
      .registerFilter('search', searchFilter)
      .build(req.query.where)
      .skipUndefined()
      .where(filter)
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
    const filter = getFilter(req, this.id, this.properties, this.userKey);
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
    const filter = getFilter(req, this.id, this.properties, this.userKey);
    return this.model.query()
      .skipUndefined()
      .patch(req.body)
      .where(filter)
      .then(affected => next())
      .catch(err => next(err));
  }

  destroy(req, res, next) {
    const filter = getFilter(req, this.id, this.properties, this.userKey);
    return this.model.query()
      .skipUndefined()
      .patch({ active: false })
      .where(filter)
      .then(() => {
        res.locals.status = 204;
        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = BaseController;
