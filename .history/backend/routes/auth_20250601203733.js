const router = require("express").Router();
const knex = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authenticateToken = require("../middleware/authenticateToken");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // ✅ Creates the folder if missing
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// We'll add our routes here
router.post('/register', upload.single('file'), async (req, res) => {
  try {
    const { name, email, password, adminCode, role } = req.body;
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null; // Added role and adminCode

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
      avatar: avatarUrl,
      role: assignedRole,
      created_at: new Date() // ✅ Add this
    })
    .returning(["id", "name", "email", "role", "avatar", "created_at"]);; 


    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  
    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });

  } catch (err) {
    console.error("Registration Error:", err);

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
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
  
      const user = await knex("users")
        .whereRaw(knex.raw("LOWER(email) = ?", [cleanEmail]))
        .first();
  
      if (!user) {
        return res.status(404).json({ error: "Invalid email or password" });
      }
  
      const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role, 
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
          role: user.role, 
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
// New Google Authentication Route
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Google token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let user = await knex("users").where({ email }).first();

    if (!user) {
      [user] = await knex("users")
        .insert({
          name,
          email,
          password: null,
          role: "user",
          google_id: payload.sub,
          avatar: picture
        })
        .returning(["id", "name", "email", "role", "avatar"]);
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Google authentication successful",
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
});


  
  // Token verification route
router.get("/verify", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    user: req.user, 
  });
});

  


module.exports = { router, authenticateToken };