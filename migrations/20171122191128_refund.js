function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.boolean('refunded');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('refunded');
    });
}

module.exports = { up, down };
