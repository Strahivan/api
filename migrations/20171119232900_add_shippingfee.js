function up(knex, Promise) {
  return knex.schema
    .table('country', table => {
      table.float('shipping_fee');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('country', table => {
      table.dropColumn('shipping_fee');
    });
}

module.exports = { up, down };
