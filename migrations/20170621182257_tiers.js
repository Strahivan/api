function up(knex, Promise) {
  return knex.schema
    .table('country', table => {
      table.jsonb('tiers');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('country', table => {
      table.dropColumn('tiers');
    });
}

module.exports = { up, down };
