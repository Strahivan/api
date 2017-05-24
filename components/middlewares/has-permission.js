function hasPermission(model, userKey, resourceId) {
  return (req, res, next) => {
    if (req.user.role === 'admin') return next();

    if (!(req.params[resourceId] || userKey)) {
      res.locals.status = 403;
      return next(new Error('You dont have permission to access this resource'));
    }

    return model.query()
      .skipUndefined()
      .findById(req.params[resourceId])
      .then((resource) => {
        if (!resource) {
          if (!resource) {
            res.locals.status = 404;
            return next(new Error('not found'));
          }
        }

        if (resource[userKey] === req.user.id) {
          return next();
        }

        res.locals.status = 403;
        return next(new Error('You dont have permission to access this resource'));
      });
  };
}

module.exports = hasPermission;
