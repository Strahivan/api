const hooks = require('hooks');
const assert = require('chai').assert;

hooks.before('GET /countries -> 200', (test, done) => {
  done();
});

hooks.after('GET /countries -> 200', (test, done) => {
  done();
});

//-----------------------------------------------------------------------------
hooks.before('POST /countries -> 201', (test, done) => {
  done();
});

hooks.after('POST /countries -> 201', (test, done) => {
  done();
});

//-----------------------------------------------------------------------------
hooks.before('GET /countries/{countryId} -> 200', (test, done) => {
  test.request.params = {
    objectId: 1
  };
  done();
});

hooks.after('GET /countries/{countryId} -> 200', (test, done) => {
  done();
});

