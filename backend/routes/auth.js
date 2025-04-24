const router = require("express").Router();
const knex = require("../config/db");
const db = require('../config/db');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// We'll add our routes here
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body; // Added role and adminCode

    // Step 1: Validation checks
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Optional: Validate role (only user or admin)
    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password.trim();

    // Step 2: Check if password is long enough
    if (cleanPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Step 3: Check if email already exists in the database
    const existingUser = await knex("users").where({ email: cleanEmail }).first();
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Step 4: Handle admin role validation
    let assignedRole = "user"; // Default role is user
    if (role === "admin") {
      if (adminCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ error: "Invalid admin code" });
      }
      assignedRole = "admin"; // If admin code is correct, assign admin role
    }

    // Step 5: Hash the password
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    // Step 6: Insert user into the database
    const [user] = await knex("users")
      .insert({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: assignedRole, // Insert the role (user or admin)
      })
      .returning(["id", "name", "email", "role"]); // Return role in the response

    // Step 7: Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 8: Send response with user and token
    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });

  } catch (err) {
    console.error("Registration Error:", err);

    if (err.code === "23505") { // Email already exists error (PostgreSQL unique constraint violation)
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Registration failed" });
  }
});



  //Rota de login
 
  
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
  
      const user = await db("users")
        .where(db.raw("LOWER(email) = ?", [cleanEmail]))
        .first();
  
      if (!user) {
        return res.status(404).json({ error: "Invalid email or password" });
      }
  
      const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // ✅ Include role in the token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role, // Include role in token
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Include role in response too
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
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