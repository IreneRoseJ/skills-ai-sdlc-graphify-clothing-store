import Stripe from "stripe";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { orderJSON } from "../utils/imageUrl.js";

const SHIPPING_RATES = { standard: 0, express: 9.99 };

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set in .env");
  }
  return new Stripe(key);
};

const clientBaseUrl = () => {
  const url = process.env.CLIENT_URL?.split(",")[0]?.trim();
  return url || "http://localhost:5173";
};

const getShippingPrice = (method) =>
  SHIPPING_RATES[method] ?? SHIPPING_RATES.standard;

const calcPrices = (items, shippingMethod = "standard") => {
  const itemsPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const shippingPrice = getShippingPrice(shippingMethod);
  return { itemsPrice, shippingPrice, totalPrice: itemsPrice + shippingPrice };
};

const validateShippingDetails = (s) => {
  const required = [
    "firstName",
    "lastName",
    "email",
    "shippingAddress",
    "city",
    "state",
    "zipCode",
    "country",
    "phoneNumber",
  ];
  for (const field of required) {
    if (!s?.[field]?.toString().trim()) {
      throw new Error(`${field} is required`);
    }
  }
};

const mapShippingToOrder = (s) => ({
  firstName: s.firstName.trim(),
  lastName: s.lastName.trim(),
  email: s.email.trim(),
  phoneNumber: s.phoneNumber.trim(),
  shippingMethod: s.shippingMethod || "standard",
  shippingAddress: {
    address: s.shippingAddress.trim(),
    city: s.city.trim(),
    state: s.state.trim(),
    postalCode: s.zipCode.trim(),
    country: s.country.trim(),
  },
});

const buildLineItems = (cartItems, currency, shippingPrice) => {
  const lines = cartItems.map((item) => ({
    price_data: {
      currency,
      product_data: {
        name: `${item.name} (${item.size})`,
        images: item.image ? [item.image] : undefined,
        metadata: {
          productId: item.product.toString(),
          size: item.size,
        },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  if (shippingPrice > 0) {
    lines.push({
      price_data: {
        currency,
        product_data: { name: "Shipping" },
        unit_amount: Math.round(shippingPrice * 100),
      },
      quantity: 1,
    });
  }

  return lines;
};

const syncCartFromBody = async (userId, items) => {
  if (!items?.length) return null;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, cartItems: [] });
  }

  cart.cartItems = items.map((item) => ({
    name: item.name,
    qty: item.qty ?? item.quantity ?? 1,
    image: item.image,
    price: item.price,
    product: item.productId || item.product,
    size: item.size || item.selectedSize,
  }));
  await cart.save();
  return cart;
};

/** GET /api/payments/config */
export const getStripeConfig = asyncHandler(async (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY?.trim() || "",
    shippingRates: SHIPPING_RATES,
  });
});

/** POST /api/payments/create-checkout-session */
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items, shippingDetails } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("No items selected for checkout");
  }

  try {
    validateShippingDetails(shippingDetails);
  } catch (e) {
    res.status(400);
    throw e;
  }

  await syncCartFromBody(req.user._id, items);

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart?.cartItems?.length) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
  const shippingMethod = shippingDetails.shippingMethod || "standard";
  const { shippingPrice } = calcPrices(cart.cartItems, shippingMethod);
  const stripe = getStripe();
  const base = clientBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: shippingDetails.email,
    line_items: buildLineItems(cart.cartItems, currency, shippingPrice),
    metadata: {
      userId: req.user._id.toString(),
      shipping: JSON.stringify(shippingDetails),
    },
    success_url: `${base}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/checkout`,
  });

  res.status(200).json({ url: session.url, sessionId: session.id });
});

/** POST /api/payments/fulfill */
export const fulfillCheckout = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    res.status(400);
    throw new Error("sessionId is required");
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.metadata?.userId !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Session does not belong to this user");
  }

  if (session.payment_status !== "paid") {
    res.status(400);
    throw new Error("Payment not completed");
  }

  const existing = await Order.findOne({
    user: req.user._id,
    "paymentResult.id": session.id,
  });
  if (existing) {
    return res.status(200).json(orderJSON(req, existing));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart?.cartItems?.length) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  let shippingDetails;
  try {
    shippingDetails = JSON.parse(session.metadata.shipping || "{}");
  } catch {
    res.status(400);
    throw new Error("Invalid shipping data on payment session");
  }

  validateShippingDetails(shippingDetails);
  const shippingFields = mapShippingToOrder(shippingDetails);
  const prices = calcPrices(cart.cartItems, shippingFields.shippingMethod);

  const order = await Order.create({
    user: req.user._id,
    orderItems: cart.cartItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.product,
      size: item.size,
    })),
    ...shippingFields,
    paymentMethod: "Stripe",
    paymentResult: {
      id: session.id,
      status: session.payment_status,
      update_time: new Date().toISOString(),
      email_address: shippingFields.email,
    },
    isPaid: true,
    paidAt: Date.now(),
    ...prices,
  });

  await cart.deleteOne();
  res.status(201).json(orderJSON(req, order));
});
