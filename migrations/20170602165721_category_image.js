function up(knex, Promise) {
  return knex.schema
    .table('category', table => {
      table.string('image');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('category', table => {
      table.dropColumn('image');
    });
}

module.exports = { up, down };
