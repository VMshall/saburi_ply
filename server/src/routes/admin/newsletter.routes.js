const express = require('express');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const newsletterValidation = require('../../validations/newsletter.crud.validation');
const newsletterController = require('../../controllers/admin/newsletter.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Newsletter Management
 *   description: Newsletter and Subscriber management
 */

/**
 * @swagger
 * /admin/newsletter/subscribers:
 *   get:
 *     summary: Get all subscribers
 *     tags: [Newsletter Management]
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
router.get('/subscribers', auth, validate(newsletterValidation.getSubscribers), newsletterController.getSubscribers);

/**
 * @swagger
 * /admin/newsletter/subscribers/download_csv:
 *   get:
 *     summary: Download subscribers as CSV
 *     tags: [Newsletter Management]
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
 */
router.get('/subscribers/download_csv', auth, newsletterController.downloadSubscribersCsv);

/**
 * @swagger
 * /admin/newsletter/subscribers/download-pdf-format:
 *   get:
 *     summary: Download subscribers as PDF
 *     tags: [Newsletter Management]
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
 */
router.get('/subscribers/download-pdf-format', auth, newsletterController.downloadSubscribersPdf);

/**
 * @swagger
 * /admin/newsletter:
 *   get:
 *     summary: Get all newsletters
 *     tags: [Newsletter Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, sending, sent]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     summary: Create a new newsletter
 *     tags: [Newsletter Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - html_content
 *             properties:
 *               subject:
 *                 type: string
 *               html_content:
 *                 type: string
 *               text_content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', auth, newsletterController.getNewsletters);
router.post('/', auth, validate(newsletterValidation.createNewsletter), newsletterController.createNewsletter);

/**
 * @swagger
 * /admin/newsletter/{newsletterId}:
 *   patch:
 *     summary: Update a newsletter
 *     tags: [Newsletter Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsletterId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               html_content:
 *                 type: string
 *               text_content:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *   delete:
 *     summary: Delete a newsletter
 *     tags: [Newsletter Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsletterId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No Content
 */
router.patch('/:newsletterId', auth, validate(newsletterValidation.updateNewsletter), newsletterController.updateNewsletter);
router.delete('/:newsletterId', auth, validate(newsletterValidation.deleteNewsletter), newsletterController.deleteNewsletter);

/**
 * @swagger
 * /admin/newsletter/{newsletterId}/send:
 *   post:
 *     summary: Send a newsletter to all active subscribers
 *     tags: [Newsletter Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsletterId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sending started
 */
router.post('/:newsletterId/send', auth, validate(newsletterValidation.sendNewsletter), newsletterController.sendNewsletter);

module.exports = router;
