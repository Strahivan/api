function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.string('bank_reference');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('bank_reference');
    });
}

module.exports = { up, down };
