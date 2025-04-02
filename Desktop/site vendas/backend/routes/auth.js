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
        const user = await db("users").where({ email }).first();

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha inválida" });
        }

        // 🔹 Generate JWT Token  
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload  
            process.env.JWT_SECRET, // Secret Key (replace with .env variable)  
            { expiresIn: "1h" } // Token expiration  
        );

        res.json({ 
            message: "Login successful", 
            token, // 🔹 Include the token in the response  
            user: { id: user.id, name: user.name, email: user.email } // Avoid sending the password  
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Server error" });
    }
});

  
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
      return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
      const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = verified; // Attach user info to request
      next();
  } catch (error) {
      res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = { router, authenticateToken };