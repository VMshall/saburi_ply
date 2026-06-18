const express = require('express');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const contactValidation = require('../../validations/contact.crud.validation');
const contactController = require('../../controllers/admin/contact.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contact Management
 *   description: Contact Management APIs
 */

/**
 * @swagger
 * /admin/contacts:
 *   get:
 *     summary: Get all contacts with pagination
 *     tags: [Contact Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of contacts
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
    .get(auth, validate(contactValidation.getContacts), contactController.getContacts);

/**
 * @swagger
 * /admin/contacts/download_csv:
 *   get:
 *     summary: Download all contacts as CSV
 *     tags: [Contact Management]
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
router.get('/download_csv', auth, contactController.downloadCsv);

/**
 * @swagger
 * /admin/contacts/download-pdf-format:
 *   get:
 *     summary: Download all contacts as PDF
 *     tags: [Contact Management]
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
router.get('/download-pdf-format', auth, contactController.downloadPdf);

/**
 * @swagger
 * /admin/contacts/{contactId}:
 *   get:
 *     summary: Get a contact
 *     tags: [Contact Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact id
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
 *     summary: Delete a contact
 *     tags: [Contact Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact id
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
    .route('/:contactId')
    .get(auth, validate(contactValidation.getContact), contactController.getContact)
    .delete(auth, validate(contactValidation.deleteContact), contactController.deleteContact);

module.exports = router;
