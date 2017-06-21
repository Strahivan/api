function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.float('cost');
      table.float('local_delivery_fee');
      table.float('price_override');
    })
    .table('country', table => {
      table.float('ems_fee');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.dropColumn('cost');
      table.dropColumn('local_delivery_fee');
      table.dropColumn('price_override');
    })
    .table('country', table => {
      table.dropColumn('ems_fee');
    });
}

module.exports = { up, down };
