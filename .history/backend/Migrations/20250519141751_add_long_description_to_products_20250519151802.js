exports.up = function(knex) {
    return knex.schema.table('products', function(table) {
      table.text('long_description');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('products', function(table) {
      table.dropColumn('long_description');
    });
  };
  