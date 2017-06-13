function up(knex, Promise) {
  return knex.schema
    .raw('ALTER SEQUENCE product_id_seq RESTART WITH 11978')
    .raw('UPDATE product SET id = nextval(\'product_id_seq\')')
    .raw('ALTER SEQUENCE request_id_seq RESTART WITH 14589')
    .raw('UPDATE request SET id = nextval(\'request_id_seq\')');
}

function down(knex, Promise) {
  return Promise.resolve();
}

module.exports = { up, down };
