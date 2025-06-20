const express = require("express");
const knex = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// ✅ 1. Get cart items for authenticated user
router.get('/', authenticateToken, async (req, res) => {
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

router.post('/add', authenticateToken, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ error: 'Product ID is required' });

  try {
    // Check if the item already exists
    const existing = await knex('user_carts')
      .where({ user_id: req.user.id, product_id: productId })
      .first();

    if (existing) {
      // Increment quantity
      await knex('user_carts')
        .where({ user_id: req.user.id, product_id: productId })
        .update({ quantity: existing.quantity + 1 });
    } else {
      // Insert new
      await knex('user_carts').insert({
        user_id: req.user.id,
        product_id: productId,
        quantity: 1,
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Add to cart failed:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
  
});

// ✅ 3. Sync full cart (bulk replace)
router.post('/sync', authenticateToken, async (req, res) => {
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

router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    await knex('user_carts').where('user_id', req.user.id).del();
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
