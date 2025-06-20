const express = require("express");
const router = express.Router();
const knex = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");    
const authenticateToken = require("../middleware/authenticateToken"); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

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

  router.put("/profile", authenticateToken, async (req, res) => {
    try {
      const { name, email, currentPassword, newPassword, confirmPassword, avatar } = req.body;

  
      const user = await knex("users").where({ id: req.user.id }).first();
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // If password change is requested, validate it
      if (newPassword || confirmPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: "Current password is required" });
        }
  
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Incorrect current password" });
        }
  
        if (newPassword !== confirmPassword) {
          return res.status(400).json({ error: "New passwords do not match" });
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await knex("users").where({ id: req.user.id }).update({ password: hashedPassword });
      }
  
      // Update name/email if changed
      await knex("users")
        .where({ id: req.user.id })
        .update({ name, email, avatar });
  
      const updatedUser = await knex("users").where({ id: req.user.id }).first();
  
      res.json({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          role: updatedUser.role,
          created_at: updatedUser.created_at,
          orders: [] // placeholder
        }
      });
    } catch (err) {
      console.error("Profile update failed:", err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  

module.exports = router;