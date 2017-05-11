require('dotenv').config();
const jsf = require('json-schema-faker');
const _ = require('lodash');

const countrySchema = require('../api/country/country.schema.json');
const requestSchema = require('../api/request/request.schema.json');
const tripSchema = require('../api/trip/trip.schema.json');
const userSchema = require('../api/user/user.schema.json');
const zoneSchema = require('../api/zone/zone.schema.json');
const categorySchema = require('../api/category/category.schema.json');

function cleanData(data, schema) {
  return data.map((item) => {
    return _.pickBy(item, (val, key) => {
      return Object.prototype.hasOwnProperty.call(schema.properties, key);
    });
  });
}

function unique(data, prop) {
  return _.uniqBy(data, prop);
}

function getRecords(count, schema) {
  let data = _.times(count, jsf.bind(undefined, schema));
  data = cleanData(data, schema);
  return data;
}

// TODO: Prompt user before clearing out schemas
// Delete ManyToMany and OneToMany tables automatically
function truncate(knex, Promise, tables) {
  return Promise.each(tables,
      table => knex.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`));
}

const tables = ['request', 'trip', '"user"', 'zone', 'country', 'category'];

function seed(knex, Promise) {
  const numberOfRecords = 10;
  return truncate(knex, Promise, tables)
    .then(() => Promise.all([
      knex('country').insert(getRecords(numberOfRecords, countrySchema)),
      knex('category').insert(getRecords(numberOfRecords, categorySchema))
    ]))
    .then(() => Promise.all([
      knex('zone').insert(getRecords(numberOfRecords, zoneSchema)),
      knex('user').insert(getRecords(numberOfRecords, userSchema))
    ]))
    .then(() => Promise.all([
      knex('trip').insert(getRecords(numberOfRecords, tripSchema))
    ]))
    .then(() => Promise.all([
      knex('request').insert(getRecords(numberOfRecords, requestSchema))
    ]));
}

module.exports = { seed };
