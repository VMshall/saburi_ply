const express = require('express');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const partnerValidation = require('../../validations/partner.crud.validation');
const partnerController = require('../../controllers/admin/partner.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Partner Management
 *   description: Partner Management APIs
 */

/**
 * @swagger
 * /admin/partners:
 *   get:
 *     summary: Get all partners with pagination
 *     tags: [Partner Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partner name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of partners
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
    .get(auth, validate(partnerValidation.getPartners), partnerController.getPartners);

/**
 * @swagger
 * /admin/partners/download_csv:
 *   get:
 *     summary: Download all partners as CSV
 *     tags: [Partner Management]
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
router.get('/download_csv', auth, partnerController.downloadCsv);

/**
 * @swagger
 * /admin/partners/download-pdf-format:
 *   get:
 *     summary: Download all partners as PDF
 *     tags: [Partner Management]
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
router.get('/download-pdf-format', auth, partnerController.downloadPdf);

/**
 * @swagger
 * /admin/partners/{partnerId}:
 *   get:
 *     summary: Get a partner
 *     tags: [Partner Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner id
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
 *     summary: Delete a partner
 *     tags: [Partner Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner id
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
    .route('/:partnerId')
    .get(auth, validate(partnerValidation.getPartner), partnerController.getPartner)
    .delete(auth, validate(partnerValidation.deletePartner), partnerController.deletePartner);

module.exports = router;
