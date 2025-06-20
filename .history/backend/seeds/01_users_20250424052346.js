exports.seed = async function (knex) {
    // Delete dependent orders FIRST
    await knex("orders").del();
    // Now safely delete users
    await knex("users").del();
  
    // Insert fresh users
    await knex("users").insert([
      { id: 1, name: "John Doe", email: "john@example.com", password: "test123" },
      { id: 2, name: "Jane Doe", email: "jane@example.com", password: "test456" },
    ]);
  };