function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.float('remaining_amount').defaultTo(0);
      table.string('second_installment');
      table.jsonb('second_installment_proof');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('remaining_amount');
      table.dropColumn('second_installment');
      table.dropColumn('second_installment_proof');
    });
}

module.exports = { up, down };
