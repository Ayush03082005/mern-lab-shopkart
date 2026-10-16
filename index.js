require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());          // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());          // parse cookies (needed to read req.cookies.token)

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);


const path = require("path");
const fs = require("fs");
const Product = require("./models/product.model");

const distPath = path.join(__dirname, "dist");
const hasDist = fs.existsSync(distPath);

if (hasDist) {
  app.use(express.static(distPath));
}

// Health check — useful to confirm the server is up
app.get("/api/health", (req, res) => {
  res.json({ message: "ShopKart Auth API is running 🛒" });
});

if (hasDist) {
  // SPA fallback for frontend client routing (Express 5 safe)
  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/customers") &&
      !req.path.startsWith("/products") &&
      !req.path.startsWith("/wishlist") &&
      !req.path.startsWith("/cart") &&
      !req.path.startsWith("/orders") &&
      !req.path.startsWith("/api")
    ) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "ShopKart Auth API is running 🛒" });
  });
}

// ── 404 handler for API routes ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Database + Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const { MongoMemoryServer } = require("mongodb-memory-server");

const defaultProducts = [
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancelling with two processors and 8 microphones.",
    price: 349.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    stock: 25,
  },
  {
    name: "Keychron K2 Mechanical Keyboard",
    description: "Wireless mechanical keyboard with Gateron G Pro switches and RGB backlight.",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    stock: 40,
  },
  {
    name: "Ultra-Slim Wireless Mouse",
    description: "Ergonomic rechargeable optical mouse with silent click and multi-device connection.",
    price: 29.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    stock: 50,
  },
  {
    name: "Classic Denim Jacket",
    description: "Premium washed cotton denim trucker jacket with button-front closure.",
    price: 79.99,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    stock: 35,
  },
  {
    name: "Minimalist Leather Sneakers",
    description: "Handcrafted white leather sneakers designed for all-day comfort and casual style.",
    price: 119.99,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
    stock: 20,
  },
  {
    name: "Clean Code by Robert C. Martin",
    description: "A handbook of agile software craftsmanship for writing maintainable code.",
    price: 44.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    stock: 30,
  },
  {
    name: "Atomic Habits by James Clear",
    description: "An easy and proven way to build good habits and break bad ones.",
    price: 18.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    stock: 45,
  },
  {
    name: "Modern Minimalist Desk Lamp",
    description: "LED desk light with adjustable color temperatures and wireless charging base.",
    price: 49.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    stock: 18,
  },
  {
    name: "Aroma Essential Oil Diffuser",
    description: "Ultrasonic cool mist humidifier with ambient LED lighting for bedroom and home office.",
    price: 32.50,
    category: "Home",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    stock: 22,
  },
];

async function seedProductsIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("🌱  Seeding sample products...");
      await Product.insertMany(defaultProducts);
      console.log(`✅  Seeded ${defaultProducts.length} sample products.`);
    }
  } catch (err) {
    console.warn("⚠️  Could not seed products:", err.message);
  }
}

async function startDatabaseAndServer() {
  let mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/shopkart";

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
  } catch (err) {
    console.log(`⚠️  Could not connect to external MongoDB (${err.message}). Starting in-memory MongoDB...`);
    const memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    await mongoose.connect(mongoUri);
  }

  console.log("✅  Connected to MongoDB");
  await seedProductsIfEmpty();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀  ShopKart server running on http://127.0.0.1:${PORT}`);
  });
}

startDatabaseAndServer().catch((err) => {
  console.error("❌  MongoDB connection failed:", err.message);
  process.exit(1);
});
