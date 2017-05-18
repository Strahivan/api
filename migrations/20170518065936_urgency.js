function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.json('dimensions');
      table.float('weight').unsigned();
    })
    .table('request', table => {
      table.boolean('urgent').defaultTo(false);
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.dropColumn('dimensions');
      table.dropColumn('weight');
    })
    .table('request', table => {
      table.dropColumn('urgent');
    });
}

module.exports = { up, down };
