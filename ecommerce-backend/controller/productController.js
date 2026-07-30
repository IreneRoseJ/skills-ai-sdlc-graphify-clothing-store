import Product from "../models/productModels.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { productJSON } from "../utils/imageUrl.js";

const VALID_CATEGORIES = ["mens", "womens", "kids"];
const VALID_SORT = ["relevance", "price_asc", "price_desc", "rating", "newest"];

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Math.max(1, Number(req.query.pageNumber) || 1);

    const filter = {};

    // --- text search (uses MongoDB text index: name, brand, description, color) ---
    const keyword = req.query.search?.trim();
    if (keyword) {
        filter.$text = { $search: keyword };
    }

    // --- category filter ---
    if (req.query.category && VALID_CATEGORIES.includes(req.query.category)) {
        filter.category = req.query.category;
    }

    // --- price range ---
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;
    }

    // --- in-stock only ---
    if (req.query.inStock === "true") {
        filter.stock = { $gt: 0 };
    }

    // --- size filter ---
    if (req.query.size) {
        filter.size = req.query.size;
    }

    // --- sorting ---
    const sort = VALID_SORT.includes(req.query.sort) ? req.query.sort : "relevance";
    let sortOption;
    if (sort === "price_asc")      sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating")     sortOption = { rating: -1 };
    else if (sort === "newest")     sortOption = { createdAt: -1 };
    else if (keyword)               sortOption = { score: { $meta: "textScore" } };
    else                            sortOption = { createdAt: -1 };

    const count = await Product.countDocuments(filter);

    const query = Product.find(filter)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sortOption);

    // Include text score in projection when sorting by relevance
    if (keyword && sort === "relevance") {
        query.select({ score: { $meta: "textScore" } });
    }

    const products = await query;

    res.json({
        products: products.map((p) => productJSON(req, p)),
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
    });
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(productJSON(req, product));
    } else {
        res.status(404).json({ message: "Product not found" });
    }
})


const createProductReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;
    const product = await Product.findById(productId);
    if (product) {
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment: comment,
        }
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ message: "Review added" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
})

export { getProducts, getProductById, createProductReview };