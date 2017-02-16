function up(knex) {
  return knex.schema
    .createTable('country', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
    })
    .createTable('zone', (table) => {
      table.increments('id').primary();
      table.integer('country_id').unsigned().notNullable().references('id').inTable('country');
      table.string('name');
    })
    .createTable('user', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('avatar');
      table.string('email').unique();
      table.string('phone').unique();
      table.string('hash');
      table.string('address');
      table.string('salt');
      table.enu('role', ['admin']);
      table.integer('country_id').unsigned().references('id').inTable('country');
      table.timestamps();
    })
    .createTable('trip', (table) => {
      table.increments('id').primary();
      table.integer('traveler_id').unsigned().notNullable().references('id').inTable('user');
      table.integer('origin_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('destination_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('zone_id').unsigned().references('id').inTable('zone');
      table.string('chat_id');
      table.integer('available_weight');
      table.text('note');
      table.date('departure');
      table.date('arrival');
      table.timestamps();
    })
    .createTable('request', (table) => {
      table.increments('id').primary();
      table.integer('source_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('destination_id').unsigned().notNullable().references('id').inTable('country');
      table.integer('customer_id').unsigned().notNullable().references('id').inTable('user');
      table.integer('trip_id').unsigned().references('id').inTable('trip');
      table.string('title');
      table.text('instructions');
      table.text('shipping_address');
      table.float('price');
      table.float('service_charge');
      table.float('carrier_charge');
      table.float('weight');
      table.json('dimensions');
      table.json('gallery');
      table.enu('status', ['pending', 'confirmed', 'processing', 'delivering', 'completed', 'failed', 'canceled']);
      table.timestamps();
    })
    .then(() => knex.raw('CREATE UNIQUE INDEX zone_country ON zone (name, country_id)'));
    // .then(() => knex.raw('ALTER TABLE trip ADD CONSTRAINT valid_departure CHECK (arrival <= departure)'));
}

function down(knex) {
  return knex.schema
    .dropTableIfExists('request')
    .dropTableIfExists('trip')
    .dropTableIfExists('user')
    .dropTableIfExists('zone')
    .dropTableIfExists('country');
}

module.exports = { up, down };
