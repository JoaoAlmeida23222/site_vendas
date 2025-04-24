const express = require("express");
const knex = require("../config/db"); // Importa o banco de dados
const authenticateToken = require("../middleware/authenticateToken");
const isAdmin = require("../middleware/isAdmin");

 // Middleware de autenticação

const router = express.Router();

// 🟢 Criar um produto
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;
    console.log("🛠️ Body received:", req.body);

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: "Nome, preço e estoque são obrigatórios" });
    }

    const [product] = await knex("products")
      .insert({ name, description, price, stock, image_url })
      .returning("*");

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Erro ao criar produto:", err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});



// 🔵 Listar todos os produtos
router.get("/", async (req, res) => {
  try {
    const products = await knex("products").select("*");

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    res.json({ products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error retrieving products" });
  }
});



// 🟠 Atualizar um produto
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url} = req.body;

    const updatedProduct = await knex("products")
      .where({ id })
      .update({ name, description, price, stock, image_url })
      .returning("*");

    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(updatedProduct[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// 🔴 Deletar um produto
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

    // Começando a consulta com os filtros de nome e descrição
    let productsQuery = knex("products")
      .where(function () {
        this.whereRaw("LOWER(name) LIKE ?", [`%${query.toLowerCase()}%`])
          .orWhereRaw("LOWER(description) LIKE ?", [`%${query.toLowerCase()}%`]);
      });

    // Verificando se foi passado o filtro de preço
    if (price_min && price_max) {
      const minPrice = parseFloat(price_min);
      const maxPrice = parseFloat(price_max);

      // Verificando se os valores de preço são válidos
      if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).json({ error: "Parâmetros de preço inválidos" });
      }

      // Log da filtragem de preços
      console.log(`Filtrando produtos de preço entre ${minPrice} e ${maxPrice}`);

      // Adicionando o filtro de preço à consulta
      productsQuery = productsQuery
        .andWhere("price", ">=", minPrice)
        .andWhere("price", "<=", maxPrice);
    }

    // Log da consulta gerada
    console.log("Consulta gerada: ", productsQuery.toString());

    // Executando a consulta no banco de dados
    const products = await productsQuery;

    // Verificando se algum produto foi encontrado
    if (products.length === 0) {
      return res.status(404).json({ error: "Nenhum produto encontrado" });
    }

    // Enviando a resposta com os produtos encontrados
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
