function up(knex, Promise) {
  return knex.schema
    .table('user', table => {
      table.string('referral_code').unique();
      table.integer('referred_by').unsigned().references('id').inTable('user');
      table.integer('referral_credit');
    })
    .table('request', table => {
      table.integer('referred_by').unsigned().references('id').inTable('user');
      table.integer('applied_credit');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('user', table => {
      table.dropColumn('referral_code');
      table.dropColumn('referred_by');
      table.dropColumn('referral_credit');
    })
    .table('request', table => {
      table.dropColumn('referred_by');
      table.dropColumn('applied_credit');
    });
}

module.exports = { up, down };
