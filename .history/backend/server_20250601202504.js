require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

const { router: authRoutes, authenticateToken } = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");

const app = express();

// ✅ Global CORS for API access
app.use(cors({
  origin: 'http://localhost:5001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Core middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// ✅ Static file serving with CORS 
app.use(
  '/uploads',
  cors({
    origin: 'http://localhost:5001', // 
    optionsSuccessStatus: 200
  }),
  express.static(path.join(__dirname, 'uploads'))
);

// ✅ Environment debug logs (optional)
console.log("Loaded ENV Keys:", Object.keys(process.env));
console.log("DB PASSWORD:", process.env.DB_PASSWORD);

// ✅ Public routes
app.use("/api/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/api/cart", cartRoutes);

// ✅ Protected routes
app.use("/api/user", authenticateToken, userRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running eheh...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
