function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.float('cost');
      table.json('tiers');
      table.float('weight');
      table.float('delta');
      table.float('local_delivery_fee');
      table.float('ems_fee');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('cost');
      table.dropColumn('local_delivery_fee');
      table.dropColumn('ems_fee');
      table.dropColumn('tiers');
      table.dropColumn('delta');
      table.dropColumn('weight');
    });
}

module.exports = { up, down };
