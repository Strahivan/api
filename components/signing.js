const aws = require('aws-sdk');
const config = require('../config/environment');

module.exports = function(req, res, next) {
  if (!(req.query || req.query.folder_name || req.query.file_name)) {
    return next(new Error('Must define folder_name and file_name'));
  }

  aws.config.update({ accessKeyId: config.aws.access, secretAccessKey: config.aws.secret });
  aws.config.update({ region: config.aws.region, signatureVersion: 'v4' });
  const s3 = new aws.S3();
  const fileName = `${(new Date()).getTime()}_${req.query.file_name}`;
  const params = {
    Bucket: config.aws.bucket,
    Key: `${req.query.folder_name}/${fileName}`,
    Expires: 300,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', params, (err, data) => {
    if (err) {
      return next(err);
    }
    res.locals.data = {
      signed_request: data
    };
    return next();
  });
};

