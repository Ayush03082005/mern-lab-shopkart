# mern-lab-shopkart

ShopKart is a modern, full-stack MERN e-commerce web application featuring customer authentication, product catalog browsing with real-time search and category filtering, cart management, wishlist functionality, and secure Razorpay payment integration.

---

## 🚀 Features

- **Customer Authentication**: Secure JWT-based authentication using HTTP-only cookies (Register, Login, Profile `/me`, and Password Change).
- **Product Catalog**: Dynamic catalog with category filtering (Electronics, Fashion, Books, Home) and debounced real-time search.
- **Cart & Wishlist**: Add, update quantities, remove items from cart, and toggle wishlist favorites.
- **Checkout & Razorpay Integration**: Server-side stock validation, order creation, and payment verification with Razorpay.
- **Automatic In-Memory DB Fallback**: Automatically connects to local MongoDB or falls back to an in-memory MongoDB server with sample seed data if external MongoDB Atlas is unreachable.
- **Responsive UI**: Built with React 19, Vite, Tailwind CSS v4, and Lucide icons.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router DOM 7, Tailwind CSS v4, Lucide React, Axios
- **Backend**: Node.js, Express 5, Mongoose 9, MongoDB / MongoDB Memory Server
- **Security & Auth**: JSON Web Tokens (JWT), bcrypt password hashing, cookie-parser
- **Payment Gateway**: Razorpay SDK

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v20+ or v22+ / v24+ LTS recommended)
- **npm** (v10+ or v11+)
- **Git**

---

## ⚙️ How to Setup & Run

### 1. Clone the Repository
```bash
git clone https://github.com/Ayush03082005/mern-lab-shopkart.git
cd mern-lab-shopkart
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```

Your `.env` should look like:
```env
PORT=3000
# Optional: falls back to in-memory MongoDB automatically if unreachable
MONGO_URI=mongodb://localhost:27017/shopkart
JWT_SECRET=shopkart_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Razorpay Test Mode Keys (Optional for local testing)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

### 4. Run the Application

#### Development Mode (Concurrent Server + Vite Client)
```bash
npm run dev
```
- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **Backend API URL**: [http://localhost:3000](http://localhost:3000)

#### Production Build & Run
```bash
npm run build
npm start
```
- The production server serves both the Express API and the built React frontend on [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs both Express API (`nodemon`) and Vite frontend concurrently |
| `npm run server` | Runs only the Express backend server with `nodemon` |
| `npm run client` | Runs only the Vite frontend dev server |
| `npm run build` | Builds the frontend React app into the `dist/` folder |
| `npm start` | Starts the production Node.js Express server |

---

## 📡 API Endpoints

### Customer Authentication
- `POST /customers/register` — Register a new customer
- `POST /customers/login` — Login customer and set HTTP-only cookie
- `GET /customers/me` — Get logged-in user profile (Protected)
- `POST /customers/logout` — Logout customer and clear cookie
- `PATCH /customers/change-password` — Change password (Protected)

### Products
- `GET /products` — Fetch all products (supports `?search=` and `?category=`)
- `GET /products/:id` — Fetch a single product by ID
- `POST /products` — Create a new product

### Wishlist
- `GET /wishlist` — Get user's wishlist (Protected)
- `POST /wishlist/:productId` — Add product to wishlist (Protected)
- `DELETE /wishlist/:productId` — Remove product from wishlist (Protected)
- `PATCH /wishlist/:productId/toggle` — Toggle product in wishlist (Protected)

### Cart
- `GET /cart` — Get user's cart (Protected)
- `POST /cart/:productId` — Add item to cart (Protected)
- `PATCH /cart/:productId` — Update item quantity (Protected)
- `DELETE /cart/:productId` — Remove item from cart (Protected)

### Orders & Checkout
- `POST /orders/create-payment-order` — Create Razorpay order and reserve order (Protected)
- `POST /orders/verify-payment` — Verify payment signature and finalize order (Protected)
- `GET /orders` — List user's orders (Protected)
- `GET /orders/:id` — Get single order details (Protected)

---

## 📄 License
ISC
