const extension = 'pg_trgm';
function up(knex) {
  const createExtension = `CREATE EXTENSION ${extension}`;
  return knex.raw(createExtension);
}

function down(knex) {
  return knex.raw(`DROP EXTENSION ${extension}`);
}

module.exports = { up, down };
