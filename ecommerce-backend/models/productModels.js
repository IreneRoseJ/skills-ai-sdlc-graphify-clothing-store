import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
},{
    timestamps: true,
});

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["mens", "womens", "kids"],
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: [String],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reviews: reviewSchema,
  numReviews: {
    type: Number,
    required: true,
  },
},{
    timestamps: true,
});

// Full-text search index — weights determine field priority in relevance score
productSchema.index(
    { name: "text", brand: "text", description: "text", color: "text" },
    { weights: { name: 10, brand: 5, color: 3, description: 2 } }
);

// Indexes for fast filtering and sorting
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ category: 1, price: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;