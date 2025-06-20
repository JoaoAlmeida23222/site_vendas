exports.up = function(knex) {
    return knex.schema.createTable('user_carts', function(table) {
      table.increments('id').primary();      
      table.integer('user_id').notNullable(); 
      table.integer('product_id').notNullable(); 
      table.integer('quantity').notNullable(); 
  
    
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_carts');
  };
  