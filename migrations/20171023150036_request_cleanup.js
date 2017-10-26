function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumns('cost', 'bank_reference', 'delta', 'ems_fee', 'platform_charge', 'trip_id', 'tiers');
    })
    .table('country', table => {
      table.dropColumns('tiers');
    })
    .table('product', table => {
      table.dropColumns('platform_charge', 'postage', 'price_override');
    })
    .dropTable('trip');
}

function down(knex, Promise) {
  return Promise.resolve();
}

module.exports = { up, down };
