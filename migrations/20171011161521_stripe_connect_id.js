function up(knex, Promise) {
  return knex.schema
    .table('shop', table => {
      table.string('shop_stripe_id');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('shop', table => {
      table.dropColumn('shop_stripe_id');
    });
}

module.exports = { up, down };
