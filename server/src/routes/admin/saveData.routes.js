const express = require('express');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const saveDataValidation = require('../../validations/saveData.crud.validation');
const saveDataController = require('../../controllers/admin/saveData.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SaveData Management
 *   description: SaveData Management APIs
 */

/**
 * @swagger
 * /admin/save-data:
 *   get:
 *     summary: Get all saved data with pagination
 *     tags: [SaveData Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email
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
 *         description: Maximum number of records
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
    .get(auth, validate(saveDataValidation.getSaveDatas), saveDataController.getSaveDatas);

/**
 * @swagger
 * /admin/save-data/download_csv:
 *   get:
 *     summary: Download all saved data as CSV
 *     tags: [SaveData Management]
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
router.get('/download_csv', auth, saveDataController.downloadCsv);

/**
 * @swagger
 * /admin/save-data/download-pdf-format:
 *   get:
 *     summary: Download all saved data as PDF
 *     tags: [SaveData Management]
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
router.get('/download-pdf-format', auth, saveDataController.downloadPdf);

/**
 * @swagger
 * /admin/save-data/{saveDataId}:
 *   get:
 *     summary: Get a saved data record
 *     tags: [SaveData Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saveDataId
 *         required: true
 *         schema:
 *           type: string
 *         description: SaveData id
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
 *     summary: Delete a saved data record
 *     tags: [SaveData Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saveDataId
 *         required: true
 *         schema:
 *           type: string
 *         description: SaveData id
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
    .route('/:saveDataId')
    .get(auth, validate(saveDataValidation.getSaveData), saveDataController.getSaveData)
    .delete(auth, validate(saveDataValidation.deleteSaveData), saveDataController.deleteSaveData);

module.exports = router;
