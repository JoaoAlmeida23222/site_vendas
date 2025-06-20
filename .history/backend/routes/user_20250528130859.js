const express = require("express");
const router = express.Router();
const knex = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// GET user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await knex("users").where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        created_at: user.created_at,
        orders: [] // Placeholder for order history
      }
    });
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// PUT update profile with avatar
router.put("/profile", authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const {
      name,
      email,
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    const user = await knex("users").where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ error: "User not found" });

    // Password update
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect current password" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await knex("users").where({ id: req.user.id }).update({ password: hashedPassword });
    }

    // Avatar upload
    let avatarUrl = user.avatar;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    // Update name/email/avatar
    await knex("users")
      .where({ id: req.user.id })
      .update({ name, email, avatar: avatarUrl });

    const updatedUser = await knex("users").where({ id: req.user.id }).first();

    res.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        created_at: updatedUser.created_at,
        orders: []
      }
    });
  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
