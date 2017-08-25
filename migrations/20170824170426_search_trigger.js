function up(knex, Promise) {
  return knex.schema
    .raw(`CREATE OR REPLACE FUNCTION generate_search_column()
            RETURNS trigger
          AS
          $BODY$
          BEGIN
            UPDATE product SET tsv = p_search.document FROM (SELECT product.id as pid, setweight(to_tsvector(brand.name), \'A\') || \' \' || setweight(to_tsvector(product.name), \'B\') as document FROM product JOIN brand ON product.brand_id = brand.id) p_search WHERE product.id = NEW.id;
            RETURN NEW;
          END;
          $BODY$
          LANGUAGE plpgsql;`)
    .raw(`CREATE TRIGGER generate_search
          AFTER INSERT OR UPDATE OF name
            ON product
          FOR EACH ROW
            EXECUTE PROCEDURE generate_search_column();`);
}

function down(knex, Promise) {
  return knex.schema
    .raw('DROP TRIGGER generate_search ON product')
    .raw('DROP FUNCTION generate_search_column()');
}

module.exports = { up, down };
