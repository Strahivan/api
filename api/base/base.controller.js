const findQuery = require('objection-find');
const _ = require('lodash');
const searchFilter = require('../../components/filters/text-search');
const utilities = require('../../components/utilities');

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
  async create(req, res) {
    const data = Object.assign({}, req.body, rejectExtras(this.properties, req.params, this.id));
    if (this.userKey) data[this.userKey] = req.user.id;
    return this.model.query()
      .insert(data)
      .then(item => utilities.responseHandler(null, res, 201, item))
      .catch(err => utilities.responseHandler(err, res));
  }

  index(req, res) {
    const filter = getFilter(req, this.id, this.properties, this.userKey);
    return findQuery(this.model)
      .registerFilter('search', searchFilter)
      .build(req.query.where)
      .skipUndefined()
      .where(filter)
      .eager(req.query.include)
      .orderBy(req.query.sort.by, req.query.sort.order)
      .page(req.query.page.number, req.query.page.size)
      .then(items => utilities.responseHandler(null, res, 200, items))
      .catch(err => utilities.responseHandler(err, res));
  }

  show(req, res) {
    const filter = getFilter(req, this.id, this.properties, this.userKey);
    return this.model.query()
      .skipUndefined()
      .where(filter)
      .first()
      .eager(req.query.include)
      .then((item) => {
        if (!item) return utilities.throwNotFound(res);
        return utilities.responseHandler(null, res, 200, item);
      })
    .catch(err => utilities.responseHandler(err, res));
  }

  update(req, res) {
    const filter = getFilter(req, this.id, this.properties, this.userKey);
    return this.model.query()
      .skipUndefined()
      .patch(req.body)
      .where(filter)
      .then(affected => utilities.responseHandler(null, res, 200))
      .catch(err => utilities.responseHandler(err, res));
  }

  destroy(req, res) {
    const filter = getFilter(req, this.id, this.properties, this.userKey);
    return this.model.query()
      .skipUndefined()
      .delete()
      .where(filter)
      .then(() => utilities.responseHandler(null, res, 204))
      .catch(err => utilities.responseHandler(err, res));
  }
}

module.exports = BaseController;
