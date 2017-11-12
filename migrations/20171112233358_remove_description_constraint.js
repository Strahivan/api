function up(knex, Promise) {
  return knex.schema
    .alterTable('product', table => {
      table.text('description').alter().nullable();
    });
}

function down(knex, Promise) {
  return knex.schema
    .alterTable('product', table => {
      table.text('description').alter().notNullable();
    });
}

module.exports = { up, down };
