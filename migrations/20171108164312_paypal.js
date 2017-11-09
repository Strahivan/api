function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.string('payment_id');
      table.string('payment_method');
      table.string('authorization_id');
      table.boolean('captured');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('payment_id');
      table.dropColumn('payment_method');
      table.dropColumn('authorization_id');
      table.dropColumn('captured');
    });
}

module.exports = { up, down };
