const request = require('request');
const querystring = require('querystring');
const User = require('../api/user/user.model');
const config = require('../config/environment');
const authUtils = require('./authutils');

exports.authenticate = function(req, res, next) {
  const accessTokenUrl = 'https://graph.facebook.com/v2.10/oauth/access_token';
  const graphApiUrl = 'https://graph.facebook.com/v2.10/me?fields=id,name,email';
  const postRedirect = `${config.webappUrl}/auth/signup?`;

  const params = {
    code: req.query.code,
    client_id: config.facebook.app_id,
    client_secret: config.facebook.app_secret,
    redirect_uri: process.env.HOST + `/auth/facebook?${querystring.encode({state: req.query.state})}`
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, (err, response, accessToken) => {
    if (response.statusCode !== 200) {
      return next(new Error(accessToken.error.message));
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, (fberr, fbresponse, profile) => {
      if (fbresponse.statusCode !== 200) {
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
                    avatar: user.avatar || 'https://graph.facebook.com/v2.10/' + profile.id + '/picture?type=large',
                    name: user.name || profile.name
                  })
                  .then(userdata => {
                    return res.redirect(301, `${postRedirect}${querystring.encode({ token: authUtils.createJWT(userdata), redirect: req.query.state })}`);
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
          .then(async (existingUser) => {
            if (existingUser) {
              if (!existingUser.email && profile.email) {
                try {
                  existingUser.$query.patch({email: profile.email});
                } catch (e) {
                  // TODO: use abstraction
                  if (e.constraint === 'user_email_unique') {
                    return User
                      .query()
                      .where({email: profile.email})
                      .first()
                      .then(user => {
                        return user
                          .$query()
                          .patchAndFetch({
                            facebook: profile.id,
                            avatar: user.avatar || 'https://graph.facebook.com/v2.10/' + profile.id + '/picture?type=large',
                            name: user.name || profile.name
                          });
                      })
                      .then(userdata => {
                        return res.redirect(301, `${postRedirect}${querystring.encode({ token: authUtils.createJWT(userdata), redirect: req.query.state })}`);
                      })
                      .catch(patchErr => next(patchErr));
                  }
                }
              }
              return res.redirect(301, `${postRedirect}${querystring.encode({ token: authUtils.createJWT(existingUser), redirect: req.query.state })}`);
            }

            const referralCode = await authUtils.getReferralCode();

            return User
              .query()
              .insert({
                name: profile.name,
                facebook: profile.id,
                referral_code: referralCode,
                email: profile.email,
                avatar: 'https://graph.facebook.com/v2.10/' + profile.id + '/picture?type=large'
              })
              .then(userdata => {
                return res.redirect(301, `${postRedirect}${querystring.encode({ token: authUtils.createJWT(userdata), redirect: req.query.state })}`);
              })
              .catch(error => {
                if (error.constraint === 'user_email_unique') {
                  return User
                    .query()
                    .where({email: profile.email})
                    .first()
                    .then(user => {
                      return user
                        .$query()
                        .patchAndFetch({
                          facebook: profile.id,
                          avatar: user.avatar || 'https://graph.facebook.com/v2.10/' + profile.id + '/picture?type=large',
                          name: user.name || profile.name
                        });
                    })
                    .then(userdata => {
                      return res.redirect(301, `${postRedirect}${querystring.encode({ token: authUtils.createJWT(userdata), redirect: req.query.state })}`);
                    })
                    .catch(patchErr => next(patchErr));
                }
                return next(error);
              });
          });
      }
    });
  });
};
