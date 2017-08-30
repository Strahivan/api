require('dotenv').config();

const morgan = require('morgan');
const compress = require('compression');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const knexConfig = require('./knexfile');
const registerApi = require('./routes');
const Model = require('objection').Model;
const knex = require('knex')(knexConfig[process.env.NODE_ENV]);

Model.knex(knex);

const allowedOrigins = ['https://novelship.com', 'http://localhost:9000', 'http://novelship.com.s3-website-ap-southeast-1.amazonaws.com'];

const app = express()
  .use(bodyParser.json())
  .use(morgan('dev'))
  .use(compress())
  .use(cors({origin: allowedOrigins, credentials: true}))
  .set('json spaces', 2);

if (process.env.NODE_ENV === 'production') {
  app.use(require('prerender-node').set('prerenderToken', '9hxefTQr2ybM1HLbwKgx'));
}

registerApi(app);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening at port %s', server.address().port);
});
