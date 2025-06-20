exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('products');
  if (!exists) {
    return knex.schema.createTable('products', function (table) {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('products');
};
