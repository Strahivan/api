function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.integer('delivery_time');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.string('delivery_time');
    });
}

module.exports = { up, down };
