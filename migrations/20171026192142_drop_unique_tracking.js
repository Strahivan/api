function up(knex, Promise) {
  return knex.schema
    .table('batch', table => {
      table.dropUnique('tracking_code', 'batch_number_unique');
    });
}

function down(knex, Promise) {
  return Promise.resolve();
}

module.exports = { up, down };
