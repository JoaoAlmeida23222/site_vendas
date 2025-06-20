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
  router.get("/profile", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const user = await knex("users").where({ id: userId }).first();
  
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
          createdAt: user.created_at, // assuming your column is `created_at`
          orders: [] // optionally include this or fetch from orders table
        }
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      res.status(500).json({ error: "Failed to load profile data" });
    }
  });
  
  

module.exports = router;