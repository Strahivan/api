function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.string('currency');
    })
    .table('request', table => {
      table.string('currency');
    })
    .table('country', table => {
      table.string('currency');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.dropColumn('currency');
    })
    .table('request', table => {
      table.dropColumn('currency');
    })
    .table('country', table => {
      table.dropColumn('currency');
    });
}

module.exports = { up, down };
