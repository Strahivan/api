function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.boolean('sold_out');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.dropColumn('sold_out');
    });
}

module.exports = { up, down };
