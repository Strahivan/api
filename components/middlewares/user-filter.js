// TODO: figure out a separate way to check user resurces
function userFilter() {
  // if role is admin, don't add user filter
  // both the creator and the traveler should be able to see the request
  return function (req, res, next) {
    if (req.user) {
      if (req.user.role === 'admin') {
        req.userSpecific = false;
        return next();
      }
      req.userSpecific = true;
      return next();
    }
    return next();
  };
}

module.exports = userFilter;
