function up(knex, Promise) {
  return knex.schema
    .createTable('collection', table => {
      table.increments('id').primary();
      table.integer('creator_id').unsigned().notNullable().references('id').inTable('user');
      table.string('name');
      table.string('banner');
      table.string('picture');
      table.text('description');
      table.boolean('active').defaultTo(true);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('collection_product', table => {
      table.increments('id').primary();
      table.integer('product_id').unsigned().notNullable().references('id').inTable('product');
      table.integer('collection_id').unsigned().notNullable().references('id').inTable('collection');
      table.unique(['product_id', 'collection_id']);
    });
}

function down(knex, Promise) {
  return knex.schema
    .dropTableIfExists('collection')
    .dropTableIfExists('collection_product');
}

module.exports = { up, down };
