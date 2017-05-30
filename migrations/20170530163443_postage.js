function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.float('postage');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.dropColumn('postage');
    });
}

module.exports = { up, down };
