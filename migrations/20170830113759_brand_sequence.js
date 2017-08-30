function up(knex, Promise) {
  return knex.schema
    .table('brand', table => {
      table.integer('sequence');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('brand', table => {
      table.dropColumn('sequence');
    });
}

module.exports = { up, down };
