// TODO: figure out a separate way to check user resurces
function userFilter(userKey) {
  // if role is admin, don't add user filter
  // else add user filter
  // both the creator and the traveler should be able to see the request
  return function (req, res, next) {
    if (req.user) {
      if (req.user.role === 'admin') {
        return next();
      }
      req.filter = Object.assign(req.filter || {}, { [userKey]: req.user.id });
      return next();
    }
    return next();
  };
}

module.exports = userFilter;
