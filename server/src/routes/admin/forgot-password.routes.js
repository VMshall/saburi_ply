const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate');
const adminValidation = require('../../validations/admin.validation');
const adminService = require('../../services/admin.service');
const catchAsync = require('../../utils/catchAsync');
const httpStatus = require('../../constants/httpStatus');

/**
 * @swagger
 * /admin/forgot-password:
 *   post:
 *     summary: Request a password reset OTP
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *     responses:
 *       200:
 *         description: Reset instructions sent if the email exists
 *       404:
 *         description: User not found
 */
router.post(
    '/',
    validate(adminValidation.forgotPassword),
    catchAsync(async (req, res) => {
        const { email } = req.body;

        // Send a reset OTP to the email (without requiring current password)
        await adminService.forgotPassword(email);

        res.status(httpStatus.OK).send({
            success: true,
            message: 'If an account with that email exists, an OTP has been sent.'
        });
    })
);

/**
 * @swagger
 * /admin/forgot-password/reset:
 *   post:
 *     summary: Reset password using OTP
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
 *                 example: "admin@example.com"
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP received via email
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 description: New password to set
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post(
    '/reset',
    validate(adminValidation.resetPassword),
    catchAsync(async (req, res) => {
        const { email, otp, password } = req.body;

        await adminService.resetPassword(email, otp, password);

        res.status(httpStatus.OK).send({
            success: true,
            message: 'Password has been reset successfully'
        });
    })
);

module.exports = router;


 