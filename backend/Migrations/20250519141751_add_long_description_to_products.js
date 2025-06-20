exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn('products', 'long_description');
  if (!hasColumn) {
    return knex.schema.alterTable('products', function (table) {
      table.text('long_description');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.alterTable('products', function (table) {
    table.dropColumn('long_description');
  });
};
