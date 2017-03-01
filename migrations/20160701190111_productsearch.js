const indexName = 'tsv_idx';
function up(knex) {
  const table = 'product';
  const column = 'name';
  const query = `CREATE INDEX ${indexName} ON ${table} USING gin(${column} gin_trgm_ops)`;
  return knex.raw(query);
}

function down(knex) {
  return knex.raw(`DROP INDEX ${indexName}`);
}

module.exports = { up, down };
