/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         stack:
 *           type: string
 *           description: Present in development only
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         token:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         brand:
 *           type: string
 *         category:
 *           type: string
 *           enum: [mens, womens, kids]
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         rating:
 *           type: number
 *         numReviews:
 *           type: number
 *         countInStock:
 *           type: number
 *         size:
 *           type: array
 *           items:
 *             type: string
 *     ProductsPage:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         page:
 *           type: integer
 *         pages:
 *           type: integer
 *     CartItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *         name:
 *           type: string
 *         qty:
 *           type: integer
 *         size:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *     Cart:
 *       type: object
 *       properties:
 *         cartItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         itemsPrice:
 *           type: number
 *         shippingPrice:
 *           type: number
 *         totalPrice:
 *           type: number
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         itemsPrice:
 *           type: number
 *         shippingPrice:
 *           type: number
 *         totalPrice:
 *           type: number
 *         isPaid:
 *           type: boolean
 *         isDelivered:
 *           type: boolean
 */

export {};
