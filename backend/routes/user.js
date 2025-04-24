const express = require("express");
const router = express.Router();
const knex = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");    
const authenticateToken = require("../middleware/authenticateToken"); 



router.get("/profile", authenticateToken, (req, res) => {
    console.log("User accessed profile:", req.user); // 👀 log it
    res.json({ message: "Profile accessed", user: req.user });
  });

  // Update user profile
  router.put('/profile', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
  
      const user = await knex('users').where({ id: userId }).first();
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // If currentPassword provided, check it
      if (currentPassword && !(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      // Build update payload
      const updatedData = {
        name: name?.trim() || user.name,
        email: email?.trim() || user.email
      };
  
      // If new password provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: 'New passwords do not match' });
        }
        if (newPassword.length < 8) {
          return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }
        updatedData.password = await bcrypt.hash(newPassword, 10);
      }
  
      await knex('users').where({ id: userId }).update(updatedData);
      const updatedUser = await knex('users').where({ id: userId }).first();
  
      res.json({ user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, createdAt: updatedUser.created_at } });
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });
  

module.exports = router;