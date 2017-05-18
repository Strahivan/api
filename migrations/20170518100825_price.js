function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('service_charge');
      table.dropColumn('carrier_charge');
      table.float('platform_charge');
    })
    .table('product', table => {
      table.float('platform_charge');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.float('service_charge');
      table.float('carrier_charge');
      table.dropColumn('platform_charge');
    })
    .table('product', table => {
      table.dropColumn('platform_charge');
    });
}

module.exports = { up, down };
