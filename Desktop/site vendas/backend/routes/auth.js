const router = require("express").Router();
const knex = require("../config/db");
const db = require('../config/db');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// We'll add our routes here
router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validate input (basic example)
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Insert user into the database
      const [user] = await knex("users")
        .insert({
          name,
          email,
          password: hashedPassword, // Store the hashed password!
        })
        .returning(["id", "name", "email"]); // Don't return the password
  
      res.status(201).json(user);
    } catch (err) {
      // Handle duplicate email error
      if (err.code === "23505") {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });


  //Rota de login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await db("users").where({ email }).first();

        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ error: "User not found" });
        }

        console.log("✅ Found user:", user);

        // Debugging: Print the received password and the stored hash
        console.log("🔹 Entered Password:", password);
        console.log("🔹 Hashed Password in DB:", user.password);

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log("🔍 Password Match:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha inválida" });
        }

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ error: "Server error" });
    }
});
  
  module.exports = router;