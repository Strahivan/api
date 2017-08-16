const request = require('request');
const User = require('../api/user/user.model');
const config = require('../config/environment');
const authUtils = require('./authutils');

exports.authenticate = function(req, res, next) {
  const accessTokenUrl = 'https://graph.facebook.com/v2.10/oauth/access_token';
  const graphApiUrl = 'https://graph.facebook.com/v2.10/me?fields=id,name,email';
  const params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.facebook.app_secret,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, (err, response, accessToken) => {
    if (response.statusCode !== 200) {
      return next(new Error(accessToken.error.message));
    }

    console.log(accessToken);

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, (fberr, fbresponse, profile) => {
      console.log(profile);
      if (response.statusCode !== 200) {
        return next(new Error(profile.error.message));
      }

      if (req.headers.authorization) {
        User
          .query()
          .where({ facebook: profile.id })
          .then((existingUser) => {
            if (existingUser) {
              return next(new Error('There is already a Facebook account that belongs to you'));
            }

            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.decode(token, config.token);

            User
              .query()
              .findById(payload.sub)
              .orWhere({email: profile.email})
              .then(user => {
                if (!user) {
                  return next(new Error('User not found'));
                }

                user
                  .$query()
                  .patchAndFetch({
                    facebook: profile.id,
                    picture: user.picture || 'https://graph.facebook.com/v2.10/' + profile.id + '/picture?type=large',
                    name: user.name || profile.name
                  })
                  .then(userdata => {
                    res.locals.data = { token: authUtils.createJWT(userdata) };
                    return next();
                  })
                  .catch(patchErr => next(patchErr));
              });
          });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User
          .query()
          .where({ facebook: profile.id })
          .first()
          .then(existingUser => {
            if (existingUser) {
              res.locals.data = { token: authUtils.createJWT(existingUser) };
              return next();
            }

            return User
              .query()
              .insert({
                name: profile.name,
                facebook: profile.id,
                email: profile.email,
                avatar: 'https://graph.facebook.com/v2.10/' + profile.id + '/picture?type=large'
              })
              .then(userdata => {
                res.locals.data = { token: authUtils.createJWT(userdata) };
                return next();
              })
              .catch(error => next(error));
          });
      }
    });
  });
};
