const findQuery = require('objection-find');
const searchFilter = require('../../components/filters/text-search');
const utilities = require('../../components/utilities');
const getUrlParams = require('../../components/middlewares/add-url-params');

class BaseController {
  constructor(model, id) {
    this.model = model;
    this.id = id;
  }

  // add middleware to check existence
  // TODO: seperate adding data to request body
  async create(req, res) {
    // FIX: creates a side effect
    getUrlParams(req, this.id);
    // TODO: check for existence of resource in req.filter
    // await this.model.query().where(req.filter).then(if exists create else error)
    return this.model.query()
      .insert(req.body)
      .then(item => utilities.responseHandler(null, res, 201, item))
      .catch(err => utilities.responseHandler(err, res));
  }

  index(req, res) {
    const filter = getUrlParams(req, this.id);
    // TODO: Use filterEager to remove the included items that don't match the where query
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
    const filter = getUrlParams(req, this.id);
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
    const filter = getUrlParams(req, this.id);
    return this.model.query()
      .skipUndefined()
      .patch(req.body)
      .where(filter)
      .then(affected => utilities.responseHandler(null, res, 200))
      .catch(err => utilities.responseHandler(err, res));
  }

  destroy(req, res) {
    const filter = getUrlParams(req, this.id);
    return this.model.query()
      .skipUndefined()
      .delete()
      .where(filter)
      .then(() => utilities.responseHandler(null, res, 204))
      .catch(err => utilities.responseHandler(err, res));
  }
}

module.exports = BaseController;
