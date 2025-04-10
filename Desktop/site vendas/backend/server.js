const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();


const { router: authRoutes, authenticateToken } = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/user");


const app = express();



// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());


// Rotas públicas (não precisam de autenticação)
app.use("/api/auth", authRoutes);
app.use("/products", productRoutes); // ✅


// Rotas protegidas (exigem autenticação)
app.use("/api/user", authenticateToken, userRoutes); 

// Test route
app.get("/", (req, res) => {
  res.send("API is running eheh...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
