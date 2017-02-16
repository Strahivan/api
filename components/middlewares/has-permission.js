const utilities = require('../utilities');

function hasPermission(model, userKey, resourceId) {
  return (req, res, next) => {
    if (req.user.role === 'admin') return next();

    if (!(req.params[resourceId] || userKey)) {
      return res.status(403).send({ message: 'You dont have permission to access this resource' });
    }

    return model.query()
      .skipUndefined()
      .findById(req.params[resourceId])
      .then((resource) => {
        if (!resource) {
          if (!resource) return utilities.throwNotFound(res);
        }

        if (resource[userKey] === req.user.id) {
          return next();
        }

        return res.status(403).send({ message: 'You dont have permission to access this resource' });
      });
  };
}

module.exports = hasPermission;
