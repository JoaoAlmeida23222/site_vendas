const express = require("express");
const knex = require("../config/db"); 
const authenticateToken = require("../middleware/authenticateToken");
const isAdmin = require("../middleware/isAdmin");

 // Middleware de autenticação

const router = express.Router();

// Criar um produto
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, price, stock, image_url, description, long_description } = req.body;
    console.log("🛠️ Body received:", req.body);

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: "Nome, preço e estoque são obrigatórios" });
    }

    const [product] = await knex("products")
      .insert({ name, description, price, stock, image_url, long_description })
      .returning("*");

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Erro ao criar produto:", err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});



// Listar todos os produtos
router.get("/", async (req, res) => {
  try {
    const products = await knex("products").select("*");

    // Optionally remove the 404 check too
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error retrieving products" });
  }
});




// Atualizar um produto
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, image_url, description, long_description } = req.body;

    const updatedProduct = await knex("products")
      .where({ id })
      .update({ name, description, price, stock, image_url,  long_description})
      .returning("*");

    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(updatedProduct[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// Apagar um produto
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await knex("products").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

// Procurar produtos
router.get("/search", async (req, res) => {
  console.log("📡 Iniciando busca de produtos...");

  const { query, price_min, price_max } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  console.log("🔍 Query recebida:", query);

  try {
    console.log("🔗 Testando conexão com o banco...");
    await knex.raw("SELECT 1");
    console.log("✅ Conectado ao banco de dados!");

    
    let productsQuery = knex("products")
      .where(function () {
        this.whereRaw("LOWER(name) LIKE ?", [`%${query.toLowerCase()}%`])
          .orWhereRaw("LOWER(description) LIKE ?", [`%${query.toLowerCase()}%`]);
      });

    
    if (price_min && price_max) {
      const minPrice = parseFloat(price_min);
      const maxPrice = parseFloat(price_max);

      
      if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).json({ error: "Parâmetros de preço inválidos" });
      }

   
      console.log(`Filtrando produtos de preço entre ${minPrice} e ${maxPrice}`);

    
      productsQuery = productsQuery
        .andWhere("price", ">=", minPrice)
        .andWhere("price", "<=", maxPrice);
    }

    
    console.log("Consulta gerada: ", productsQuery.toString());

    
    const products = await productsQuery;

   
    if (products.length === 0) {
      return res.status(404).json({ error: "Nenhum produto encontrado" });
    }

    
    res.json({
      products,
      count: products.length
    });

  } catch (err) {
    console.error("💥 Erro ao buscar produtos:", err);
    res.status(500).json({
      error: "Erro ao buscar produtos",
      details: err.message
    });
  }
});











// 🟡 Buscar um produto pelo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await knex("products").where({ id }).first();

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produto irmãozinho" });
  }
});

module.exports = router;
