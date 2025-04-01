exports.up = function (knex) {
    return knex.schema.createTable("orders", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.integer("product_id").unsigned().references("id").inTable("products");
      table.integer("quantity").notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("orders");
  };