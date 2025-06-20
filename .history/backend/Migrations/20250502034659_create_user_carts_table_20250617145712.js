exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('user_carts');
  if (!exists) {
    return knex.schema.createTable('user_carts', function (table) {
      table.increments('id').primary();
      table.integer('user_id').notNullable();
      table.integer('product_id').notNullable();
      table.integer('quantity').notNullable();
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_carts');
};
