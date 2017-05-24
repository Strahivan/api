function respond(req, res, next) {
  return res.status(res.locals.status || 200).send(res.locals.data);
}

module.exports = respond;
