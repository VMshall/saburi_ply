const express = require('express');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const enquiryValidation = require('../../validations/enquiry.crud.validation');
const enquiryController = require('../../controllers/admin/enquiry.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Enquiry Management
 *   description: Enquiry Management APIs
 */

/**
 * @swagger
 * /admin/enquiries:
 *   get:
 *     summary: Get all enquiries with pagination
 *     tags: [Enquiry Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *         description: Product
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of enquiries
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
    .get(auth, validate(enquiryValidation.getEnquiries), enquiryController.getEnquiries);

/**
 * @swagger
 * /admin/enquiries/download_csv:
 *   get:
 *     summary: Download all enquiries as CSV
 *     tags: [Enquiry Management]
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
router.get('/download_csv', auth, enquiryController.downloadCsv);

/**
 * @swagger
 * /admin/enquiries/download-pdf-format:
 *   get:
 *     summary: Download all enquiries as PDF
 *     tags: [Enquiry Management]
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
router.get('/download-pdf-format', auth, enquiryController.downloadPdf);

/**
 * @swagger
 * /admin/enquiries/{enquiryId}:
 *   get:
 *     summary: Get an enquiry
 *     tags: [Enquiry Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enquiryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry id
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
 *     summary: Delete an enquiry
 *     tags: [Enquiry Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enquiryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry id
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
    .route('/:enquiryId')
    .get(auth, validate(enquiryValidation.getEnquiry), enquiryController.getEnquiry)
    .delete(auth, validate(enquiryValidation.deleteEnquiry), enquiryController.deleteEnquiry);

module.exports = router;
