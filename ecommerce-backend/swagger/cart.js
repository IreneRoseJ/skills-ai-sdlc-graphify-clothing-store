/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart (login required)
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart with totals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *   post:
 *     summary: Add to cart (merges qty for same product + size)
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, size]
 *             properties:
 *               productId:
 *                 type: string
 *               size:
 *                 type: string
 *               qty:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Cart updated
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */

/**
 * @swagger
 * /api/cart/{productId}:
 *   patch:
 *     summary: Set item quantity (replaces, does not add)
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [qty]
 *             properties:
 *               qty:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Quantity updated
 *   delete:
 *     summary: Remove line item
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed
 */

export {};
