function up(knex, Promise) {
/*  return knex
    .raw('CREATE EXTENSION postgis')
    .then(() => {
      return Promise.all([
        knex.raw("SELECT AddGeometryColumn ('trip','location',3857,'POINT',2);"),
        knex.schema.table('trip', (table) => {
          table.jsonb('coordinates');
        })
      ]);
    });
*/

return Promise.resolve()
}

function down(knex, Promise) {
/*  return Promise.all([
    knex.raw('DROP EXTENSION postgis'),
    knex.schema
      .table('trip', (table) => {
        table.dropColumn('location');
        table.dropColumn('coordinates');
      })
  ]);
*/
return Promise.resolve()
}

module.exports = { up, down };
