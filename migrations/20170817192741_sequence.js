function up(knex, Promise) {
  return knex.schema
    .table('collection', table => {
      table.integer('sequence').unsigned();
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('collection', table => {
      table.dropColumn('sequence');
    });
}

module.exports = { up, down };
