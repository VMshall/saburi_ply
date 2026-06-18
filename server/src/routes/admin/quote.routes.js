const express = require('express');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const quoteValidation = require('../../validations/quote.crud.validation');
const quoteController = require('../../controllers/admin/quote.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quote Management
 *   description: Quote Management APIs
 */

/**
 * @swagger
 * /admin/quotes:
 *   get:
 *     summary: Get all quotes with pagination
 *     tags: [Quote Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name
 *       - in: query
 *         name: phone_number
 *         schema:
 *           type: string
 *         description: Phone Number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of quotes
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
 *         description: Start date
 *       - in: query
 *         name: until_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date
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
    .get(auth, validate(quoteValidation.getQuotes), quoteController.getQuotes);

/**
 * @swagger
 * /admin/quotes/download_csv:
 *   get:
 *     summary: Download all quotes as CSV
 *     tags: [Quote Management]
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
router.get('/download_csv', auth, quoteController.downloadCsv);

/**
 * @swagger
 * /admin/quotes/download-pdf-format:
 *   get:
 *     summary: Download all quotes as PDF
 *     tags: [Quote Management]
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
router.get('/download-pdf-format', auth, quoteController.downloadPdf);

/**
 * @swagger
 * /admin/quotes/{quoteId}:
 *   get:
 *     summary: Get a quote
 *     tags: [Quote Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quoteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quote id
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *   delete:
 *     summary: Delete a quote
 *     tags: [Quote Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quoteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quote id
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 */
router
    .route('/:quoteId')
    .get(auth, validate(quoteValidation.getQuote), quoteController.getQuote)
    .delete(auth, validate(quoteValidation.deleteQuote), quoteController.deleteQuote);

module.exports = router;
