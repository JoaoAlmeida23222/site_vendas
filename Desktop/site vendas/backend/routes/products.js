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
router.get("/", async (req, res) => {
  try {
    const products = await knex("products").select("*");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
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
    res.status(500).json({ error: "Erro ao buscar produto" });
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




module.exports = router;
