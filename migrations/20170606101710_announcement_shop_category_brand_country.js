function up(knex, Promise) {
  return knex.schema
    .table('announcement', table => {
      table.string('title');
      table.integer('sequence');
      table.boolean('active').notNullable().defaultTo(true);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .table('shop', table => {
      table.string('image');
      table.string('description');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .table('category', table => {
      table.text('description');
    })
    .table('brand', table => {
      table.string('logo');
      table.string('description');
    })
    .table('country', table => {
      table.string('lang');
      table.string('shortcode');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('announcement', table => {
      table.dropColumn('title');
      table.dropColumn('sequence');
      table.dropColumn('active');
      table.dropColumn('created_at');
      table.dropColumn('updated_at');
    })
    .table('shop', table => {
      table.dropColumn('image');
      table.dropColumn('description');
      table.dropColumn('created_at');
      table.dropColumn('updated_at');
    })
    .table('category', table => {
      table.dropColumn('description');
    })
    .table('brand', table => {
      table.dropColumn('logo');
      table.dropColumn('description');
    })
    .table('country', table => {
      table.dropColumn('lang');
      table.dropColumn('shortcode');
    });
}

module.exports = { up, down };
