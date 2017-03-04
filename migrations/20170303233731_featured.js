function up(knex) {
  return knex.schema
    .table('product', (table) => {
      table.dropColumn('status');
    })
    .table('product', (table) => {
      table.boolean('active').defaultTo(true);
      table.boolean('featured').defaultTo(false);
    });
}

function down(knex) {
  return knex.schema
    .table('product', (table) => {
      table.enu('status', ['closed', 'open']);
    })
    .table('product', (table) => {
      table.dropColumn('active');
      table.dropColumn('featured');
    });
}

module.exports = { up, down };
