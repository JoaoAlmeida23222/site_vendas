exports.seed = async function (knex) {
    // Delete dependent orders FIRST
    await knex("orders").del();
    // Now safely delete products
    await knex("products").del();
  
    // Insert fresh products
    await knex("products").insert([
      { id: 1, name: "Laptop", price: 999.99, stock: 10 },
      { id: 2, name: "Smartphone", price: 599.99, stock: 20 },
      { id: 3, name: "Headphones", price: 149.99, stock: 30 },
    ]);
  };