exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn('products', 'image_url');
  if (!hasColumn) {
    return knex.schema.alterTable('products', function (table) {
      table.string('image_url', 255);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.alterTable('products', function (table) {
    table.dropColumn('image_url');
  });
};
