const express = require('express');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const subscriberValidation = require('../../validations/subscriber.crud.validation');
const subscriberController = require('../../controllers/admin/subscriber.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subscriber Management
 *   description: Newsletter subscriber management
 */

/**
 * @swagger
 * /admin/subscribers:
 *   get:
 *     summary: Get all subscribers
 *     tags: [Subscriber Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, unsubscribed, bounced]
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
 *         description: OK
 */
router.get('/', subscriberController.getSubscribers);

/**
 * @swagger
 * /admin/subscribers:
 *   post:
 *     summary: Create a subscriber
 *     tags: [Subscriber Management]
 *     security:
 *       - bearerAuth: []
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
 *               status:
 *                 type: string
 *                 enum: [pending, active, unsubscribed, bounced]
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', subscriberController.createSubscriber);

/**
 * @swagger
 * /admin/subscribers/download-csv:
 *   get:
 *     summary: Download subscribers as CSV
 *     tags: [Subscriber Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 */
router.get('/download-csv', auth, subscriberController.downloadCsv);

/**
 * @swagger
 * /admin/subscribers/download-pdf:
 *   get:
 *     summary: Download subscribers as PDF
 *     tags: [Subscriber Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file
 */
router.get('/download-pdf', auth, subscriberController.downloadPdf);

/**
 * @swagger
 * /admin/subscribers/{subscriberId}:
 *   delete:
 *     summary: Delete a subscriber
 *     tags: [Subscriber Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No Content
 */
router.delete('/:subscriberId', auth, validate(subscriberValidation.deleteSubscriber), subscriberController.deleteSubscriber);

module.exports = router;
