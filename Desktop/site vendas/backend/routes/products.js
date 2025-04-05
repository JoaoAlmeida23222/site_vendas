const express = require("express");
const knex = require("../config/db"); // Importa o banco de dados
const authenticateToken = require("../middleware/authenticateToken");
 // Middleware de autenticação

const router = express.Router();

// 🟢 Criar um produto
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: "Nome, preço e estoque são obrigatórios" });
    }

    const [product] = await knex("products")
      .insert({ name, description, price, stock })
      .returning("*");

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// 🔵 Listar todos os produtos
// Rota para retornar todos os produtos com paginação
router.get("/", authenticateToken, async (req, res) => {
  // Recebe o número da página e o limite por página
  const { page = 1, limit = 10 } = req.query;

  try {
    // Calcula o offset com base na página e limite
    const offset = (page - 1) * limit;

    // Retorna os produtos com a paginação
    const products = await knex("products")
      .limit(limit) // Limita o número de resultados por página
      .offset(offset); // Pula os primeiros "offset" produtos

    // Conta o total de produtos para facilitar a navegação
    const totalProducts = await knex("products").count("id as count");

    res.json({
      products,
      totalProducts: totalProducts[0].count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts[0].count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});


// 🟠 Atualizar um produto
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const updatedProduct = await knex("products")
      .where({ id })
      .update({ name, description, price, stock })
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
router.delete("/:id", authenticateToken, async (req, res) => {
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
