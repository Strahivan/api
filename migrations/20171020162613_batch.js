function up(knex, Promise) {
  return knex.schema
    .table('batch', table => {
      table.boolean('closed').defaultTo(false);
      table.string('shipping_provider');
      table.string('name');
      table.renameColumn('number', 'tracking_code');
    })
    .raw('ALTER SEQUENCE batch_id_seq RESTART WITH 1978')
    .raw('UPDATE batch SET id = nextval(\'batch_id_seq\')');
}

function down(knex, Promise) {
  return knex.schema
    .table('batch', table => {
      table.dropColumn('closed');
      table.dropColumn('shipping_provider');
      table.dropColumn('name');
      table.renameColumn('tracking_code', 'number');
    });
}

module.exports = { up, down };
