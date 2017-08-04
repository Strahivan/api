function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.float('discount');
    })
    .table('request', table => {
      table.float('discount');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.dropColumn('discount');
    })
    .table('request', table => {
      table.dropColumn('discount');
    });
}

module.exports = { up, down };
