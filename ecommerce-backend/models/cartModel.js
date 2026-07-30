import mongoose from "mongoose";

const cartItemSchema = {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    size: { type: String, required: true },
};

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        cartItems: [cartItemSchema],
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
