import Order from '../models/orderModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { orderJSON } from '../utils/imageUrl.js';

export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.status(200).json(orderJSON(req, order));
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.status(200).json(orders.map((o) => orderJSON(req, o)));
});



export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders.map((o) => orderJSON(req, o)));
});

