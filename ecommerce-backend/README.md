# ecommerce-backend

Express + MongoDB API for the clothing store (auth, products, cart, orders, Stripe checkout, Swagger).

Entry point: `server.js`. Environment variables are loaded from the **repo root** `.env` (not this folder).

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)
- npm (install from the **repo root**)

## Environment

Create a `.env` file at the **repository root** (`clothing-store/.env`):

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/clothing-store
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
API_PUBLIC_URL=http://localhost:3000
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_CURRENCY=usd
```

| Variable | Purpose |
|----------|---------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs auth JWTs (cookie `jwt` / Bearer) |
| `CLIENT_URL` | Frontend origin(s) for CORS and Stripe redirect (comma-separated OK) |
| `API_PUBLIC_URL` | Public API base URL (image URLs, Swagger server) |
| `STRIPE_SECRET_KEY` | Required for checkout sessions |

## How to run

From the **repository root** (not `ecommerce-backend/`):

```bash
# 1. Install API dependencies
npm install

# 2. Ensure MongoDB is running, then start the API (nodemon)
npm start
```

The API listens on `http://localhost:3000` by default.

### Useful URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000/ | Dev health message |
| http://localhost:3000/api-docs | Swagger UI |
| http://localhost:3000/api/products | Product list |

### Seed sample data

Still from the repo root (uses root `.env`):

```bash
npm run data:import    # load users + ~200 products
npm run data:destroy   # clear seeded collections
```

The first seeded user is an admin.

### Production-style start

```bash
npm run build          # install + build frontend into ecommerce-frontend/dist
NODE_ENV=production npm run start:prod
```

In production the API also serves the built storefront.

## API overview

| Prefix | Notes |
|--------|--------|
| `/api/users` | Register, login, logout; saved addresses |
| `/api/products` | List/search, detail, reviews |
| `/api/cart` | Auth required; body includes `productId`, `qty`, `size` |
| `/api/orders` | Auth required |
| `/api/payments` | Stripe checkout session + fulfill |

## Project layout

```
ecommerce-backend/
  server.js           # Express app entry
  config/             # DB, Swagger
  controller/         # Route handlers
  routes/             # Express routers
  models/             # Mongoose models
  middleware/         # auth, errors, asyncHandler
  data/               # Seed data
  swagger/            # OpenAPI fragments
```
