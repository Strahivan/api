const hooks = require('hooks');
const assert = require('chai').assert;

hooks.before('GET /collections -> 200', (test, done) => {
  done();
});

hooks.after('GET /collections -> 200', (test, done) => {
  done();
});

//-----------------------------------------------------------------------------
hooks.before('POST /collections -> 201', (test, done) => {
  done();
});

hooks.after('POST /collections -> 201', (test, done) => {
  done();
});

//-----------------------------------------------------------------------------
hooks.before('GET /collections/{countryId} -> 200', (test, done) => {
  test.request.params = {
    objectId: 1
  };
  done();
});

hooks.after('GET /collections/{countryId} -> 200', (test, done) => {
  done();
});

