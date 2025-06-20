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

router.post('/add', authenticateToken, async (req, res) => {
  const { productId } = req.body;

  try {
    const existingItem = await knex('user_carts')
      .where({ user_id: req.user.id, product_id: productId })
      .first();

    if (existingItem) {
      await knex('user_carts')
        .where({ user_id: req.user.id, product_id: productId })
        .update({ quantity: existingItem.quantity + 1 });
    } else {
      await knex('user_carts').insert({
        user_id: req.user.id,
        product_id: productId,
        quantity: 1,
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
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

// ✅ 4. Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await knex('user_carts').where('user_id', req.user.id).del();
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
