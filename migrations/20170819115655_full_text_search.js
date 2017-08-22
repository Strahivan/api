function up(knex, Promise) {
  return knex.schema
    .raw('ALTER TABLE product ADD COLUMN tsv tsvector')
    .raw('CREATE INDEX product_tsv_index ON product USING gin(tsv)')
    .raw('UPDATE product SET tsv = p_search.document FROM (SELECT product.id as pid, setweight(to_tsvector(brand.name), \'A\') || \' \' || setweight(to_tsvector(product.name), \'B\') as document FROM product JOIN brand ON product.brand_id = brand.id) p_search WHERE product.id = p_search.pid');
}

function down(knex, Promise) {
  return knex.schema
    .table('product', table => {
      table.dropColumn('tsv');
    });
}

module.exports = { up, down };
