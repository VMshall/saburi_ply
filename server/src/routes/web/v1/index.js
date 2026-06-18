const express = require('express');
const router = express.Router();
const validate = require('../../../middleware/validate');

// Controllers
const contactController = require('../../../controllers/web/contact.controller');
const partnerController = require('../../../controllers/web/partner.controller');
const quoteController = require('../../../controllers/web/quote.controller');
const enquiryController = require('../../../controllers/web/enquiry.controller');

// Validations
const contactValidation = require('../../../validations/contact.validation');
const partnerValidation = require('../../../validations/partner.validation');
const quoteValidation = require('../../../validations/quote.validation');
const enquiryValidation = require('../../../validations/enquiry.validation');
const newsletterController = require('../../../controllers/web/newsletter.controller');
const newsletterValidation = require('../../../validations/newsletter.validation');
const saveDataController = require('../../../controllers/web/saveData.controller');
const saveDataValidation = require('../../../validations/saveData.validation');

/*
 * Web V1 Router
 * Purpose: Aggregates all web-specific routes for version 1.
 */

// Health Check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK Web V1', uptime: process.uptime() });
});

/**
 * @swagger
 * tags:
 *   name: Web Public
 *   description: Public facing submission APIs
 */

/**
 * @swagger
 * /web/v1/add-newsletter-email:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Web Public]
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
 *     responses:
 *       200:
 *         description: Successfully subscribed
 */
router.post('/add-newsletter-email',
    validate(newsletterValidation.subscribe),
    newsletterController.subscribe
);

/**
 * @swagger
 * /web/v1/contact-us:
 *   post:
 *     summary: Submit a contact inquiry
 *     tags: [Web Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone_number
 *               - state
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               state:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/contact-us',
    validate(contactValidation.createContact),
    contactController.createContact
);

/**
 * @swagger
 * /web/v1/become-partner:
 *   post:
 *     summary: Apply to become a partner
 *     tags: [Web Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - firm_name
 *               - email
 *               - contact_number
 *               - city
 *               - partner_type
 *             properties:
 *               name:
 *                 type: string
 *               firm_name:
 *                 type: string
 *               email:
 *                 type: string
 *               contact_number:
 *                 type: string
 *               city:
 *                 type: string
 *               partner_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/become-partner',
    validate(partnerValidation.createPartner),
    partnerController.createPartner
);

/**
 * @swagger
 * /web/v1/quote:
 *   post:
 *     summary: Request a quote
 *     tags: [Web Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone_number
 *               - product_type
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               company_name:
 *                 type: string
 *               inquiry_type:
 *                 type: string
 *               product_type:
 *                 type: string
 *               estimated_qty:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/quote',
    validate(quoteValidation.createQuote),
    quoteController.createQuote
);

/**
 * @swagger
 * /web/v1/enquiry:
 *   post:
 *     summary: Submit a product enquiry
 *     tags: [Web Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone_number
 *               - state
 *               - city
 *               - product
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               product:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/enquiry',
    validate(enquiryValidation.createEnquiry),
    enquiryController.createEnquiry
);

/**
 * @swagger
 * /web/v1/save-data:
 *   post:
 *     summary: Save data
 *     tags: [Web Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/save-data',
    validate(saveDataValidation.createSaveData),
    saveDataController.createSaveData
);

module.exports = router;
