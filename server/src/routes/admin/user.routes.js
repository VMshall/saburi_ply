const express = require('express');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const userValidation = require('../../validations/user.crud.validation');
const userController = require('../../controllers/admin/user.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: User Management APIs
 */

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                  type: string
 *                  enum: [user, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               role: user
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   get:
 *     summary: Get all users with pagination
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: User role
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: until_date
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
    .route('/')
    .post(auth, validate(userValidation.createUser), userController.createUser)
    .get(auth, validate(userValidation.getUsers), userController.getUsers);

/**
 * @swagger
 * /admin/users/download_csv:
 *   get:
 *     summary: Download all users as CSV
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: until_date
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: CSV file
 *       401:
 *         description: Unauthorized
 */
router.get('/download_csv', auth, userController.downloadCsv);

/**
 * @swagger
 * /admin/users/download-pdf-format:
 *   get:
 *     summary: Download all users as PDF
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: until_date
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: PDF file
 *       401:
 *         description: Unauthorized
 */
router.get('/download-pdf-format', auth, userController.downloadPdf);

/**
 * @swagger
 * /admin/users/{userId}:
 *   get:
 *     summary: Get a user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *   patch:
 *     summary: Update a user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               role: user
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *   delete:
 *     summary: Delete a user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not Found
 */
router
    .route('/:userId')
    .get(auth, validate(userValidation.getUser), userController.getUser)
    .patch(auth, validate(userValidation.updateUser), userController.updateUser)
    .delete(auth, validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
