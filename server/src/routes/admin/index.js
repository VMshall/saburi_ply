const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const partnerRoutes = require('./partner.routes');
const contactRoutes = require('./contact.routes');
const enquiryRoutes = require('./enquiry.routes');
const quoteRoutes = require('./quote.routes');
const userRoutes = require('./user.routes');
const newsletterRoutes = require('./newsletter.routes');
const subscriberRoutes = require('./subscriber.routes');
const forgotPasswordRoutes = require('./forgot-password.routes');
const saveDataRoutes = require('./saveData.routes');

router.use('/', authRoutes);
router.use('/', dashboardRoutes);
router.use('/partners', partnerRoutes);
router.use('/contacts', contactRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/quotes', quoteRoutes);
router.use('/users', userRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/forgot-password', forgotPasswordRoutes);
router.use('/save-data', saveDataRoutes);

module.exports = router;
