function up(knex, Promise) {
  return knex.schema
    .createTable('announcement', table => {
      table.increments('id').primary();
      table.jsonb('description_style');
      table.string('description');
      table.string('image');
      table.string('c2a');
      table.string('url');
    });
}

function down(knex, Promise) {
  return knex.schema
    .dropTableIfExists('announcement');
}

module.exports = { up, down };
