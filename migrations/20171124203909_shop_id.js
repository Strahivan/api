function up(knex, Promise) {
  return knex.schema
    .raw('ALTER TABLE request DROP constraint request_shop_id_foreign')
    .alterTable('request', table => {
      table.integer('shop_id').alter().unsigned().notNullable().references('id').inTable('shop');
    });
}

function down(knex, Promise) {
  return Promise.resolve();
}

module.exports = { up, down };
