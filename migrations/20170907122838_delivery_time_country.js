function up(knex, Promise) {
  return knex.schema
    .table('country', table => {
      table.integer('delivery_time');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('country', table => {
      table.dropColumn('delivery_time');
    });
}

module.exports = { up, down };
