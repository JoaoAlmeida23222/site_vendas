exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn('users', 'role');
  if (!hasColumn) {
    return knex.schema.alterTable('users', function (table) {
      table.string('role', 255).defaultTo('user');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.dropColumn('role');
  });
};
