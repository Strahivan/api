const hooks = require('hooks');
const rp = require('request-promise');
const config = require('../../config/environment');

function authenticate() {
  const options = {
    method: 'POST',
    uri: 'http://localhost:3000/auth/login',
    body: {
      email: config.test.email,
      password: config.test.password,
    },
    json: true,
  };
  return rp(options);
}

hooks.before('GET /requests -> 200', (test, done) => {
  done();
});

hooks.after('GET /requests -> 200', (test, done) => {
  done();
});

//-----------------------------------------------------------------------------
hooks.before('POST /requests -> 201', (test, done) => {
  authenticate()
  .then((res) => {
    test.request.headers.Authorization = `Bearer ${res.token}`;
    test.request.body = {
      title: 'Lard of the Pings',
    };
    done();
  })
  .catch(err => done(err));
});

hooks.after('POST /requests -> 201', (test, done) => {
  done();
});

//-----------------------------------------------------------------------------
hooks.before('GET /requests/{requestId} -> 200', (test, done) => {
  test.request.params = {
    requestId: 1,
  };
  done();
});

hooks.after('GET /requests/{requestId} -> 200', (test, done) => {
  console.log(test);
  done();
});

