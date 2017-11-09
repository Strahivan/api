function up(knex, Promise) {
  return knex.schema
    .table('collection_product', table => {
      table.float('sequence');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('collection_product', table => {
      table.dropColumn('sequence');
    });
}

module.exports = { up, down };
