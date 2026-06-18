const express = require('express');
const router = express.Router();
const validate = require('../../middleware/validate');
const adminValidation = require('../../validations/admin.validation');
const authController = require('../../controllers/admin/auth.controller');
const auth = require('../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Authentication APIs for Admin and Users
 */

/**
 * @swagger
 * /admin/create-user:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already exists or invalid input
 */
// Create User
router.post('/create-user', validate(adminValidation.createUser), authController.createUser);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/login', validate(adminValidation.login), authController.login);

/**
 * @swagger
 * /admin/login-otp:
 *   post:
 *     summary: Login by requesting an OTP (requires email and password)
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       404:
 *         description: User not found
 *       429:
 *         description: Account locked (Too many failed attempts)
 */
// Login - Send OTP
router.post('/login-otp', validate(adminValidation.loginOtp), authController.loginOtp);

/**
 * @swagger
 * /admin/verify-otp:
 *   post:
 *     summary: Verify OTP and Login
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid OTP or expired
 *       429:
 *         description: Account locked
 */
// Verify OTP
router.post('/verify-otp', validate(adminValidation.verifyOtp), authController.verifyOtp);

/**
 * @swagger
 * /admin/verify-forgot-password-otp:
 *   post:
 *     summary: Verify Forgot Password OTP
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP or expired
 */
router.post('/verify-forgot-password-otp', validate(adminValidation.verifyOtp), authController.verifyForgotPasswordOtp);

/**
 * @swagger
 * /admin/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid OTP or expired
 */
router.post('/reset-password', validate(adminValidation.resetPassword), authController.resetPassword);

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Logout of current session
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/me:
 *   get:
 *     summary: Get current user
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
