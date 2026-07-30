import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModels.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { cartJSON, orderJSON } from "../utils/imageUrl.js";

const calcPrices = (items) => {
    const itemsPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return { itemsPrice, shippingPrice: 0, totalPrice: itemsPrice };
};

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, cartItems: [] });
    }
    return cart;
};

const parseCartInput = (body) => {
    if (body.cartItems?.length) return body.cartItems;
    if (body.items?.length) return body.items;
    if (body.productId || body.product) {
        return [
            {
                product: body.productId || body.product,
                qty: body.qty ?? 1,
                size: body.size,
            },
        ];
    }
    return null;
};

/** GET /api/cart */
export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return res.status(200).json({
            cartItems: [],
            itemsPrice: 0,
            shippingPrice: 0,
            totalPrice: 0,
        });
    }
    const prices = calcPrices(cart.cartItems);
    res.status(200).json({ ...cartJSON(req, cart), ...prices });
});

/** POST /api/cart — add item (productId + size + qty, or full item in items[]) */
export const addToCart = asyncHandler(async (req, res) => {
    const input = parseCartInput(req.body);

    if (!input?.length) {
        res.status(400);
        throw new Error("No cart items");
    }

    const cart = await getOrCreateCart(req.user._id);

    for (const entry of input) {
        if (!entry.size) {
            res.status(400);
            throw new Error("size is required for each item");
        }

        let item = entry;
        if (entry.product && !entry.name) {
            const product = await Product.findById(entry.product);
            if (!product) {
                res.status(404);
                throw new Error(`Product not found: ${entry.product}`);
            }
            item = {
                name: product.name,
                qty: entry.qty ?? 1,
                image: product.image,
                price: product.price,
                product: product._id,
                size: entry.size,
            };
        }

        if (!item.product || !item.name || item.price == null || !item.image) {
            res.status(400);
            throw new Error("Each item needs product, name, price, image, size, and qty");
        }

        const existing = cart.cartItems.find(
            (i) =>
                i.product.toString() === item.product.toString() &&
                i.size === item.size
        );

        if (existing) {
            existing.qty += item.qty;
        } else {
            cart.cartItems.push(item);
        }
    }

    await cart.save();
    const prices = calcPrices(cart.cartItems);
    res.status(200).json({ ...cartJSON(req, cart), ...prices });
});

/** PATCH /api/cart/:productId?size=M — set qty (replaces, does not add) */
export const updateCartItemQty = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { size } = req.query;
    const qty = Number(req.body.qty);

    if (!size) {
        res.status(400);
        throw new Error("size query param is required");
    }
    if (!Number.isInteger(qty) || qty < 1) {
        res.status(400);
        throw new Error("qty must be an integer of at least 1");
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const item = cart.cartItems.find(
        (i) => i.product.toString() === productId && i.size === size
    );
    if (!item) {
        res.status(404);
        throw new Error("Item not found in cart");
    }

    item.qty = qty;
    await cart.save();
    const prices = calcPrices(cart.cartItems);
    res.status(200).json({ ...cartJSON(req, cart), ...prices });
});

/** DELETE /api/cart/:productId?size=M */
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { size } = req.query;

    if (!size) {
        res.status(400);
        throw new Error("size query param is required");
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const before = cart.cartItems.length;
    cart.cartItems = cart.cartItems.filter(
        (item) =>
            !(item.product.toString() === productId && item.size === size)
    );

    if (cart.cartItems.length === before) {
        res.status(404);
        throw new Error("Item not found in cart");
    }

    if (cart.cartItems.length === 0) {
        await cart.deleteOne();
        return res.status(200).json({
            message: "Cart is empty",
            cartItems: [],
            itemsPrice: 0,
            shippingPrice: 0,
            totalPrice: 0,
        });
    }

    await cart.save();
    const prices = calcPrices(cart.cartItems);
    res.status(200).json({ ...cartJSON(req, cart), ...prices });
});

/** DELETE /api/cart — clear all items */
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        await cart.deleteOne();
    }
    res.status(200).json({
        message: "Cart cleared",
        cartItems: [],
        itemsPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
    });
});


