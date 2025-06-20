exports.seed = async function (knex) {
  // Delete dependent orders FIRST
  await knex("orders").del();
  // Now safely delete products
  await knex("products").del();

  await knex("products").insert([
    {
      id: 1,
      name: "Halter 10kg",
      description: "Par de halteres de 10kg para treino de força.",
      price: 89.90,
      stock: 20,
      image_url: "/images/produto_strap.jpg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      name: "Colchonete para Yoga",
      description: "Colchonete antiderrapante ideal para yoga e pilates.",
      price: 59.90,
      stock: 35,
      image_url: "/images/produto_strap.jpg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      name: "Barra Olímpica",
      description: "Barra de aço inoxidável com capacidade de até 250kg.",
      price: 299.00,
      stock: 10,
      image_url: "/images/produto_strap.jpg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      name: "Roda de Abdominal",
      description: "Ideal para fortalecer o core e músculos abdominais.",
      price: 39.90,
      stock: 50,
      image_url: "/images/produto_strap.jpg",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      name: "Kettlebell 16kg",
      description: "Kettlebell de 16kg para treinos funcionais e de força.",
      price: 109.90,
      stock: 15,
      image_url: "/images/produto_strap.jpg",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};
