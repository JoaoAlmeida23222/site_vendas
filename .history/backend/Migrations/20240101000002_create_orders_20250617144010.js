exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('orders');
  if (!exists) {
    return knex.schema.createTable('orders', function (table) {
      table.increments('id').primary();
      table.integer('user_id');
      table.integer('product_id');
      table.integer('quantity').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('orders');
};

