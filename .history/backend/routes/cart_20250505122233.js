const express = require("express");
const knex = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get('/api/cart', authenticateToken, async (req, res) => {
    try {
      const cartItems = await knex('user_carts')
        .join('products', 'user_carts.product_id', 'products.id')
        .where('user_carts.user_id', req.user.id)
        .select('products.*', 'user_carts.quantity');
  
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  });
  
  // 2. Update cart sync
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
      res.status(500).json({ error: 'Failed to sync cart' });
    }
  });
  
  // 3. Update clear cart
  router.delete('/clear', authenticateToken, async (req, res) => {
    try {
      await knex('user_carts').where('user_id', req.user.id).del();
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  });
    
    // Token verification route

  
    module.exports = router; 