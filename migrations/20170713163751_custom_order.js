function up(knex, Promise) {
  return Promise.all([
    knex.schema
    .table('request', table => {
      table.jsonb('product_details');
      table.string('merchant_message');
      table.integer('shop_id').unsigned().references('id').inTable('category');
    }),
    knex.raw('ALTER TABLE request ALTER COLUMN base_price DROP NOT NULL '),
    knex.raw('ALTER TABLE request ALTER COLUMN total_price DROP NOT NULL')
  ]);
}

function down(knex, Promise) {
  return Promise.all([
    knex.schema
    .table('request', table => {
      table.dropColumn('product_details');
      table.string('merchant_message');
      table.dropColumn('shop_id');
    }),
    knex.raw('ALTER TABLE request ALTER COLUMN base_price SET NOT NULL'),
    knex.raw('ALTER TABLE request ALTER COLUMN total_price SET NOT NULL')
  ]);
}

module.exports = { up, down };
