function up(knex, Promise) {
  return knex.schema
    .table('', table => {
      table.string('');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('', table => {
      table.dropColumn('');
    });
}

module.exports = { up, down };
