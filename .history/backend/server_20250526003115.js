require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");



const { router: authRoutes, authenticateToken } = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");


const app = express();



// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

console.log("Loaded ENV Keys:", Object.keys(process.env));
console.log("DB PASSWORD:", process.env.DB_PASSWORD);

// Rotas públicas (não precisam de autenticação)
app.use("/api/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/api/cart",  cartRoutes); // ✅



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
