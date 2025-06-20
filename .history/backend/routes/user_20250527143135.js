const express = require("express");
const router = express.Router();
const knex = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");    
const authenticateToken = require("../middleware/authenticateToken"); 

  // Update user profile
  router.get("/profile", authenticateToken, async (req, res) => {
    try {
      const user = await knex("users").where({ id: req.user.id }).first();
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          created_at: user.created_at,
          orders: [] // if you don’t have orders yet, leave as empty array
        }
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      res.status(500).json({ error: "Failed to load profile" });
    }
  });
  

module.exports = router;