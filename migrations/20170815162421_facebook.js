function up(knex, Promise) {
  return knex.schema
    .table('user', table => {
      table.string('facebook').unique();
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('user', table => {
      table.dropColumn('facebook');
    });
}

module.exports = { up, down };
