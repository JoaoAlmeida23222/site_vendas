exports.seed = async function (knex) {
    await knex("orders").del();
    await knex("orders").insert([
      { user_id: 1, product_id: 1, quantity: 2 },
      { user_id: 2, product_id: 2, quantity: 1 },
    ]);
  };