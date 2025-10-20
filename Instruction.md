
# 📘 Project Instructions

Welcome! This document explains how to install, configure, and run the Express.js products API in this repository. It also documents available endpoints, middleware behavior (API key auth, pagination, logging), and common troubleshooting tips.

## 🚀 Prerequisites

- Node.js (v18+) and npm installed. Verify with:

```bash
node -v
npm -v
```
- A MongoDB connection URI (you can use MongoDB Atlas or a local MongoDB server).

## 📦 Install dependencies

From the project root, run:

```bash
npm install
```

This installs the dependencies listed in `package.json` (express, mongoose, dotenv, uuid, nodemon for development, etc.).

If you prefer to install the listed dependencies explicitly, you can run these commands instead:

Install production dependencies:

```bash
npm install express mongoose dotenv uuid body-parser
```

Install dev dependencies (nodemon):

```bash
npm install -D nodemon
```

## 🔧 Environment variables

Create a `.env` file in the project root (already included in this repo for the assignment). The project expects the following variables:

- `PORT` – port to run the server (default: 3000)
- `MONGODB_URI` – MongoDB connection string
- `API_KEY` – API key used by the authentication middleware

Example `.env` values:

```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/Assignment_Week2
API_KEY=abc123xyz789
```

If you use a different filename for env values, load it appropriately before starting the server.

## 🧭 How to run the server

- Start in development (auto-restarts using nodemon):

```bash
npm run dev
```

- Start in production mode:

```bash
npm start
```

The server entry is `expressServer.js` and it will attempt to connect to MongoDB via `config/db.js` before starting.

## 🧩 What this project contains

- `expressServer.js` — main app that wires middleware, connects to DB and starts the server.
- `server.js` — alternate entry (kept from template, see `package.json` main).
- `routes/Routes.js` — all API routes and route-level middleware registration.
- `Model/products.js` — Mongoose model for Product.
- `Middleware/` — contains custom middleware:
	- `logger.js` — request logger (method, url, timestamp)
	- `Authenticator.js` — API key authentication middleware (expects `x-api-key` header)
	- `pagination.js` — pagination middleware (responds with paged products when used)
	- `errorHandler.js` — global error handler
- `config/db.js` — MongoDB connection helper

## 🛠️ API Endpoints

> All routes are protected by the `x-api-key` header (API key authentication). Include the header in every request.

Base URL: http://localhost:3000

- GET / -> Simple hello world text

- GET /api/products
	- Returns products. Note: this project currently uses a pagination middleware that, when registered globally, will return a paginated response directly. If you call this endpoint without pagination query params it will still return the paginated structure.
	- Query params:
		- `page` (number) — page number (default: 1)
		- `limit` (number) — items per page (default: 10)
	- Example: `/api/products?page=2&limit=5`

- GET /api/products/:id
	- Get a product by its `id` field (uuid stored on creation).

- GET /api/products/category?category=Electronics
	- Filter products by category. Returns 400 if `category` is not provided.

- POST /api/products
	- Create a product. Request body JSON must include `name`, `description`, `price`, `category`. `inStock` is optional.
	- Example body:

```json
{
	"name": "Laptop",
	"description": "A fast laptop",
	"price": 1299.99,
	"category": "Electronics",
	"inStock": true
}
```

- PUT /api/products/:id
	- Update a product by `id`. Returns 404 if not found.

- DELETE /api/products/:id
	- Delete a product by `id`.

## 🔐 Authentication (API Key)

This project protects routes using the `Authenticator` middleware. Add a header `x-api-key` with the value of `API_KEY` from your `.env` file.

Example using curl:

```bash
curl -H "Content-Type: application/json" \
		 -H "x-api-key: abc123xyz789" \
		 "http://localhost:3000/api/products?page=1&limit=5"
```

## 📚 Pagination behavior

- The middleware `Middleware/pagination.js` calculates `skip` from `page` and `limit`, uses `Product.countDocuments()` for the total count, and returns a structured JSON including `currentPage`, `limit`, `totalItems`, `totalPages`, and `products`.
- Important note: pagination is currently registered globally in `routes/Routes.js` (`router.use(pagination)`), so any request to the router will immediately return the paginated products response (status 200) and will not fall through to route handlers. If you want pagination only for `/api/products`, move the middleware to that specific route:

```js
// Instead of router.use(pagination)
router.get('/api/products', pagination, async (req, res) => {
	// your code if pagination middleware calls next() instead of responding
});
```

If you prefer the `GET /api/products` route to return all products without pagination, remove the middleware or change its behavior to attach pagination results to `req` (for example `req.pagination = {...}`) and call `next()`.

## ✅ Validation & Error Handling

- The project includes basic validation (Mongoose schema required fields) and a global error handler `Middleware/errorHandler.js` which returns a JSON error response.
- Routes use try/catch to catch async errors. Validation errors from Mongoose return 400 with the error message.

## 🧪 Quick testing examples

1) Start the server:

```bash
npm run dev
```

2) Create a product (replace API key and host as needed):

```bash
curl -X POST http://localhost:3000/api/products \
	-H "Content-Type: application/json" \
	-H "x-api-key: abc123xyz789" \
	-d '{"name":"Phone","description":"Smartphone","price":699.99,"category":"Electronics"}'
```

3) Get paginated products:

```bash
curl -H "x-api-key: abc123xyz789" "http://localhost:3000/api/products?page=1&limit=5"
```

## 📝 Notes & suggestions

- If you want pagination and route handlers to co-exist, modify the pagination middleware to call `next()` and attach results to `req.pagination` instead of sending the response directly.
- Add input validation middleware (e.g., celebrate or express-validator) for stricter request validation before saving/updating.
- For production, do not commit real `.env` credentials into source control. Use `.env.example` showing required variables.

## 📦 Project status

- Module system: ES modules (see `package.json` -> "type": "module").
- Mongoose model exports `Product` as a named export; files import it using `import { Product } from './Model/products.js'`.

---

