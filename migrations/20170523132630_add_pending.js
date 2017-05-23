function up(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('status');
    })
    .table('request', table => {
      table.enu('status', ['pending', 'confirmed', 'processing', 'delivering', 'ready', 'completed', 'failed', 'canceled']).defaultTo('confirmed');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('status');
    })
    .table('request', table => {
      table.enu('status', ['confirmed', 'processing', 'delivering', 'ready', 'completed', 'failed', 'canceled']).defaultTo('confirmed');
    });
}

module.exports = { up, down };
