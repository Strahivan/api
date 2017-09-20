function up(knex, Promise) {
  return knex.schema
    .table('announcement', table => {
      table.string('mobile_image_url');
    });
}

function down(knex, Promise) {
  return knex.schema
    .table('announcement', table => {
      table.dropColumn('mobile_image_url');
    });
}

module.exports = { up, down };
