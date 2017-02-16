/**
 * addUser
 *
 * @param {string} userKey - the column name containing the user id
 * @returns {function} - middleware
 */
function addUser(userKey) {
  return (req, res, next) => {
    req.body[userKey] = req.user.id;
    return next();
  };
}

module.exports = addUser;
