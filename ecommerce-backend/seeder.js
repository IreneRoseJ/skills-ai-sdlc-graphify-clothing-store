import path from "path";
import { fileURLToPath } from "url";
import users from "./data/users.js";
import dotenv from "dotenv";
import products from "./data/products.js";
import Order from "./models/orderModel.js";
import Product from "./models/productModels.js";
import User from "./models/userModel.js";
import connectDB from "./config/db.js";
import colors from "colors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => ({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      size: product.size,
      color: product.color,
      rating: product.rating,
      stock: product.stock,
      image: product.image,
      user: adminUser,
      description: product.description ?? "Sample product description.",
      numReviews: product.numReviews ?? 0,
    }));

    await Product.insertMany(sampleProducts);
    console.log("Data imported successfully".green.inverse);
    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed successfully".red.inverse);
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  if (process.argv[2] === "-d") {
    await destroyData();
  } else {
    await importData();
  }
};

run();
