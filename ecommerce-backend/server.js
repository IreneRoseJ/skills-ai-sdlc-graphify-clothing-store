import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";

if (!process.env.API_PUBLIC_URL?.trim()) {
  process.env.API_PUBLIC_URL =
    process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;
}

const app = express();

const clientOrigins = process.env.CLIENT_URL?.split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: clientOrigins?.length ? clientOrigins : true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("API running. Try /api-docs");
  });
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// --- API (before production SPA) ---
app.use("/api/products", productRoutes);


app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "production") {
  const spaDist = path.join(__dirname, "..", "ecommerce-frontend", "dist");
  app.use(express.static(spaDist));
  // Express 5 requires a named wildcard, not bare "*"
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(spaDist, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
    console.log(`Swagger UI: ${process.env.API_PUBLIC_URL}/api-docs`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
