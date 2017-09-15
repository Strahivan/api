function up(knex, Promise) {
  return knex.schema
    .raw(`CREATE OR REPLACE FUNCTION generate_search_column()
            RETURNS trigger
          AS
          $BODY$
          BEGIN
            UPDATE product SET tsv = p_search.document
            FROM (SELECT p.id as pid, setweight(to_tsvector(b.name), 'A') || ' ' || setweight(to_tsvector(p.name), 'B') as document
              FROM product p JOIN brand b ON (p.brand_id = b.id)) p_search
            WHERE product.id = p_search.pid AND p_search.pid = NEW.id;
            RETURN NEW;
          END;
          $BODY$
          LANGUAGE plpgsql;`)
    .raw('CREATE TRIGGER generate_search AFTER INSERT OR UPDATE OF name ON product FOR EACH ROW EXECUTE PROCEDURE generate_search_column();');
}

function down(knex, Promise) {
  return knex.schema
    .raw('DROP TRIGGER generate_search ON product')
    .raw('DROP FUNCTION generate_search_column()');
}

module.exports = { up, down };
