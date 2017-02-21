// NOTE: this is supposed to be a middleware but express
// middlewares don't have access to whole set of params
// https://github.com/expressjs/express/issues/3177

function castToNum(obj) {
  const numObj = {};
  Object.entries(obj).forEach((entry) => {
    Object.assign(numObj, { [entry[0]]: Number(entry[1]) });
  });
  return numObj;
}

// TODO: add a parameter-columnname map
function getUrlParams(req, resourceId) {
  let urlParams = Object.assign({}, req.params);
  if (Object.keys(urlParams).length) {
    urlParams = castToNum(urlParams);
    // replace resourceId key with "id" since
    // models have no <resourceId> column
    if (resourceId && urlParams[resourceId]) {
      const temp = urlParams[resourceId];
      delete urlParams[resourceId];
      urlParams.id = temp;
    }
    // if creating an object, add the params to the object
    if (req.method === 'POST') {
      Object.assign(req.body, urlParams);
    }
  }
  // additional filters like user specific resource
  // TODO: separate it
  // TODO: write tests
  return Object.assign({}, req.filters || {}, urlParams);
}

module.exports = getUrlParams;
