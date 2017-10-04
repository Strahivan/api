function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.renameColumn('order_count', 'sequence');
      table.renameColumn('sold_out', 'out_of_stock');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.renameColumn('sequence', 'order_count');
      table.renameColumn('out_of_stock', 'sold_out');
    });
}

module.exports = { up, down };
