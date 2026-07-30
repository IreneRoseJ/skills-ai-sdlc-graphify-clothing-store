/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Registration and authentication
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: User already exists
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in (sets httpOnly jwt cookie)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Log out (clear jwt cookie)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logged out
 *   get:
 *     summary: Log out (GET alias)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logged out
 */

export {};
