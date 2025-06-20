const express = require("express");
const knex = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// ✅ 1. Get cart items for authenticated user
router.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cartItems = await knex('user_carts')
      .join('products', 'user_carts.product_id', 'products.id')
      .where('user_carts.user_id', req.user.id)
      .select('products.*', 'user_carts.quantity');

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// ✅ 2. Add single product to cart (new endpoint)
router.post('/api/cart/add', authenticateToken, async (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const existingItem = await knex('user_carts')
      .where({ user_id: req.user.id, product_id })
      .first();

    if (existingItem) {
      await knex('user_carts')
        .where({ user_id: req.user.id, product_id })
        .update({ quantity: existingItem.quantity + quantity });
    } else {
      await knex('user_carts').insert({
        user_id: req.user.id,
        product_id,
        quantity,
      });
    }

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});

// ✅ 3. Sync full cart (bulk replace)
router.post('/api/cart/sync', authenticateToken, async (req, res) => {
  try {
    await knex.transaction(async trx => {
      await trx('user_carts').where('user_id', req.user.id).del();

      if (req.body.items.length > 0) {
        await trx('user_carts').insert(
          req.body.items.map(item => ({
            user_id: req.user.id,
            product_id: item.id,
            quantity: item.quantity
          }))
        );
      }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sync cart' });
  }
});

// ✅ 4. Clear cart
router.delete('/api/cart/clear', authenticateToken, async (req, res) => {
  try {
    await knex('user_carts').where('user_id', req.user.id).del();
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
