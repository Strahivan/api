function up(knex, Promise) {
  return knex.schema
    .raw('ALTER TABLE request DROP CONSTRAINT request_status_check')
    .raw('ALTER TABLE request ADD CONSTRAINT request_status_check CHECK (status = ANY (ARRAY[\'pending\'::text, \'confirmed\'::text, \'processing\'::text, \'delivering\'::text, \'ready\'::text, \'completed\'::text, \'failed\'::text, \'verify\'::text, \'approval\'::text, \'rejected\'::text, \'canceled\'::text]))');
}

function down(knex, Promise) {
  return knex.schema
    .raw('ALTER TABLE request DROP CONSTRAINT request_status_check')
    .raw('ALTER TABLE request ADD CONSTRAINT request_status_check CHECK (status = ANY (ARRAY[\'pending\'::text, \'confirmed\'::text, \'processing\'::text, \'delivering\'::text, \'ready\'::text, \'completed\'::text, \'failed\'::text, \'canceled\'::text]))');
}

module.exports = { up, down };
