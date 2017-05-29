function up(knex, Promise) {
  return knex.schema
    .createTable('batch', table => {
      table.increments('id').primary();
      table.string('number').unique();
      table.boolean('paid').notNullable().defaultTo(false);
      table.boolean('active').notNullable().defaultTo(true);
      table.integer('source_id').notNullable().unsigned().references('id').inTable('country');
      table.integer('destination_id').unsigned().references('id').inTable('country');
      table.integer('shop_id').notNullable().unsigned().references('id').inTable('shop');
      table.timestamp('shipping_date').notNullable().defaultTo(knex.fn.now());
      table.timestamp('arrival_date').defaultTo(knex.fn.now());
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .table('request', table => {
      table.integer('batch_id').unsigned().references('id').inTable('batch');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('request', table => {
      table.dropColumn('batch_id');
    })
    .dropTableIfExists('batch');
}

module.exports = { up, down };
