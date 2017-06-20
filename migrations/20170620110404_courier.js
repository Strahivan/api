function up(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.float('courier');
    })
    .raw('ALTER TABLE request DROP CONSTRAINT request_collection_method_check')
    .raw('ALTER TABLE request ADD CONSTRAINT request_collection_method_check CHECK (collection_method = ANY (ARRAY[\'pickup\'::text, \'post\'::text, \'courier\'::text]))');
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.dropColumn('courier');
    });
}

module.exports = { up, down };
