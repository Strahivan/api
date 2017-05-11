const hooks = require('hooks');

hooks.before('GET /zones -> 200', (test, done) => {
  done();
});

hooks.after('GET /zones -> 200', (test, done) => {
  done();
});

//-----------------------------------------------------------------------------
hooks.before('POST /zones -> 201', (test, done) => {
  done();
});

hooks.after('POST /zones -> 201', (test, done) => {
  done();
});

//-----------------------------------------------------------------------------
hooks.before('GET /zones/{zoneId} -> 200', (test, done) => {
  test.request.params = {
    objectId: 1
  };
  done();
});

hooks.after('GET /zones/{zoneId} -> 200', (test, done) => {
  done();
});

