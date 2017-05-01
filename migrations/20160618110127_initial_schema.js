function up(knex) {
  return knex.schema
    .createTable('country', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.boolean('active').notNullable().defaultTo(true);
    })
    .createTable('category', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.integer('parent_id').unsigned().references('id').inTable('category');
      table.boolean('active').notNullable().defaultTo(true);
    })
    .createTable('zone', (table) => {
      table.increments('id').primary();
      table.integer('country_id').unsigned().notNullable().references('id').inTable('country');
      table.string('name');
      table.boolean('active').notNullable().defaultTo(true);
    })
    .createTable('user', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('avatar');
      table.string('email').unique();
      table.string('phone').unique();
      table.string('hash');
      table.string('salt');
      table.string('stripe_token');
      table.jsonb('address');
      table.enu('role', ['admin']);
      table.integer('country_id').unsigned().references('id').inTable('country');
      table.boolean('active').notNullable().defaultTo(true);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('shop', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.integer('owner_id').unsigned().notNullable().references('id').inTable('user');
      table.boolean('active').notNullable().defaultTo(false); // a shop needs to be approved
    })
    .createTable('brand', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.boolean('active').notNullable().defaultTo(true);
    })
    .createTable('trip', (table) => {
      table.increments('id').primary();
      table.integer('traveler_id').unsigned().notNullable().references('id').inTable('user');
      table.integer('origin_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('destination_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('zone_id').unsigned().references('id').inTable('zone');
      table.integer('available_weight');
      table.string('chat_id');
      table.text('note');
      table.date('departure');
      table.date('arrival');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('product', (table) => {
      table.increments('id').primary();
      table.integer('category_id').unsigned().notNullable().references('id').inTable('category');
      table.integer('source_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('shop_id').unsigned().notNullable().references('id').inTable('shop');
      table.integer('brand_id').unsigned().references('id').inTable('brand');
      table.integer('order_count').unsigned();
      table.integer('delivery_time');
      table.boolean('preorder');
      table.boolean('featured').defaultTo(false);
      table.float('price').notNullable().unsigned();
      table.jsonb('colors');
      table.jsonb('editions');
      table.jsonb('gallery');
      table.jsonb('sizes'); // dimension, price difference, weight
      table.enu('collection_method', ['pickup', 'post']);
      table.string('name').notNullable();
      table.string('url', 512);
      table.text('description').notNullable();
      table.boolean('active').notNullable().defaultTo(true);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('request', (table) => {
      table.increments('id').primary();
      table.integer('customer_id').unsigned().notNullable().references('id').inTable('user');
      table.integer('source_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('destination_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('product_id').unsigned().references('id').inTable('product');
      table.integer('trip_id').unsigned().references('id').inTable('trip');
      table.integer('count').unsigned();
      table.boolean('preorder');
      table.date('delivery_date');
      table.enu('collection_method', ['pickup', 'post']);
      table.enu('status', ['confirmed', 'processing', 'delivering', 'ready', 'completed', 'failed', 'canceled']).defaultTo('confirmed');
      table.float('base_price').unsigned().notNullable();
      table.float('carrier_charge');
      table.float('postage');
      table.float('service_charge');
      table.float('total_price').unsigned().notNullable();
      table.jsonb('color');
      table.jsonb('edition');
      table.jsonb('shipping_address');
      table.jsonb('size'); // dimension, price difference, weight
      table.string('stripe_charge_id');
      table.text('instructions');
      table.boolean('active').notNullable().defaultTo(true);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .then(() => knex.raw('CREATE UNIQUE INDEX zone_country ON zone (name, country_id)'))
    .then(() => knex.raw('ALTER TABLE product ADD CONSTRAINT either_or CHECK (url IS NOT NULL OR gallery IS NOT NULL)'));
}

function down(knex) {
  return knex.schema
    .dropTableIfExists('request')
    .dropTableIfExists('product')
    .dropTableIfExists('trip')
    .dropTableIfExists('user')
    .dropTableIfExists('zone')
    .dropTableIfExists('category')
    .dropTableIfExists('country');
}

module.exports = { up, down };
