const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');
const validate = require('../../middleware/validate');
const dashboardValidation = require('../../validations/dashboard.validation');
const auth = require('../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin Dashboard
 *   description: Dashboard Statistics
 */

/**
 * @swagger
 * /admin/get-dashboard-stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get('/get-dashboard-stats', auth, dashboardController.getDashboardStats);

/**
 * @swagger
 * /admin/get-recent-submissions:
 *   get:
 *     summary: Get recent submissions from all sources
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
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
 *         description: Recent submissions retrieved successfully
 */
router.get('/get-recent-submissions', auth, validate(dashboardValidation.getRecentSubmissions), dashboardController.getRecentSubmissions);

module.exports = router;
