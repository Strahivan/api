function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.renameColumn('editions', 'variations');
    })
    .table('request', table => {
      table.renameColumn('edition', 'variation');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.renameColumn('variations', 'editions');
    })
    .table('request', table => {
      table.renameColumn('variation', 'edition');
    });
}

module.exports = { up, down };
