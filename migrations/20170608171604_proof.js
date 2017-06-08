function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.json('proof');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('proof');
    });
}

module.exports = { up, down };
