exports.up = function (knex) {
    return knex.schema.createTable("products", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.decimal("price", 10, 2).notNullable(); // e.g., 999.99
      table.integer("stock").defaultTo(0);
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("products");
  };