function up(knex, Promise) {
  return knex.schema
    .table('user', table => {
      table.jsonb('meta');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('user', table => {
      table.dropColumn('meta');
    });
}

module.exports = { up, down };
