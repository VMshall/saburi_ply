const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const logger = require('../utils/logger');

/*
 * Email Service
 * Purpose: Configures Nodemailer and handles sending emails.
 */

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    requireTLS: true,
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        logger.error('SMTP Connection Error:', error);
    } else {
        logger.info('SMTP Server is ready to take our messages');
    }
});

/*
 * Send basic email
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @param {Array} attachments - Optional attachments (e.g., for CID-embedded images)
 */
const sendEmail = async (to, subject, html, attachments = []) => {
    logger.info(`Attempting to send email to: ${to} with subject: ${subject}`);
    const msg = { from: process.env.EMAIL_FROM, to, subject, html, attachments };
    try {
        const info = await transporter.sendMail(msg);
        logger.info(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    } catch (error) {
        logger.error(`Error sending email to ${to}:`, error);
        // We do NOT re-throw here to prevent crashing the transaction commit flow if email fails.
        // In a strictly reliable system, this might go to a queue (like BullMQ).
    }
};

/*
 * Send Notification
 * Handles selecting the correct template and sending the email.
 * Sends:
 *  - Admin email to marketing@saburiply.com using admin_notification.ejs
 *  - User email to data.email using user_thank_you.ejs
 * Both wrapped with layout.ejs and including CID-embedded logo.
 *
 * @param {string} type - 'contact', 'partner', 'quote', 'enquiry'
 * @param {object} data - Data to populate the templates
 */
const sendNotification = async (type, data) => {
    logger.info(`Preparing notification for type: ${type}`);

    if (!data || !data.email) {
        logger.error('User email (data.email) is missing; cannot send user notification');
    }

    let adminSubject;
    let userSubject;
    let adminTitle;

    switch (type) {
        case 'contact':
            adminSubject = 'New Contact Inquiry - Saburi Ply';
            userSubject = 'Thank you for contacting Saburi Ply';
            adminTitle = 'New Contact Inquiry';
            break;
        case 'partner':
            adminSubject = 'New Partner Application - Saburi Ply';
            userSubject = 'We’ve received your partner application - Saburi Ply';
            adminTitle = 'New Partner Application';
            break;
        case 'quote':
            adminSubject = 'New Quote Request - Saburi Ply';
            userSubject = 'We’ve received your quote request - Saburi Ply';
            adminTitle = 'New Quote Request';
            break;
        case 'enquiry':
            adminSubject = 'New Product Enquiry - Saburi Ply';
            userSubject = 'We’ve received your product enquiry - Saburi Ply';
            adminTitle = 'New Product Enquiry';
            break;
        default:
            return;
    }

    // Ensure data is a plain object for the template (fixes issue with Sequelize instances)
    const templateData = (data && typeof data.toJSON === 'function') ? data.toJSON() : data;

    // Common attachments (CID logo and check icon)
    const attachments = [
        {
            filename: 'site_logo.webp',
            path: path.join(__dirname, '../assets/site_logo.webp'),
            cid: 'site_logo',
        },
        {
            filename: 'check.png',
            path: path.join(__dirname, '../assets/check.png'),
            cid: 'check_icon',
        },
    ];

    let adminHtml;
    let userHtml;

    try {
        // Admin body (data table of submission)
        const adminBody = await ejs.renderFile(
            path.join(__dirname, '../views/emails/admin_notification.ejs'),
            { data: templateData, type }
        );

        adminHtml = await ejs.renderFile(
            path.join(__dirname, '../views/emails/layout.ejs'),
            { title: adminTitle, body: adminBody }
        );

        // User body (pretty thank-you)
        const userBody = await ejs.renderFile(
            path.join(__dirname, '../views/emails/user_thank_you.ejs'),
            { data: templateData, type }
        );

        userHtml = await ejs.renderFile(
            path.join(__dirname, '../views/emails/layout.ejs'),
            { title: 'Thank You', body: userBody }
        );
    } catch (err) {
        logger.error('Error rendering EJS templates for notification:', err);
        return;
    }

    // Admin email
    try {
        await sendEmail('marketing@saburiply.com', adminSubject, adminHtml, attachments);
    } catch (err) {
        // sendEmail already logs errors; this is just a safety net
        logger.error('Failed to send admin notification email:', err);
    }

    // User email (only if we have the user email)
    if (data && data.email) {
        try {
            await sendEmail(data.email, userSubject, userHtml, attachments);
        } catch (err) {
            logger.error('Failed to send user thank-you email:', err);
        }
    }
};

/*
 * Send OTP Email
 * @param {string} to
 * @param {string} otp
 */
const sendOtpEmail = async (to, otp) => {
    logger.info(`Sending OTP email to: ${to}`);

    // CID attachments
    const attachments = [
        {
            filename: 'site_logo.webp',
            path: path.join(__dirname, '../assets/site_logo.webp'),
            cid: 'site_logo',
        }
    ];

    try {
        // Render body
        const bodyValue = await ejs.renderFile(
            path.join(__dirname, '../views/emails/otp_login.ejs'),
            { otp }
        );

        // Render layout with body
        const html = await ejs.renderFile(
            path.join(__dirname, '../views/emails/layout.ejs'),
            { title: 'Your OTP Code', body: bodyValue }
        );

        await sendEmail(to, 'Your Login OTP - Saburi Ply', html, attachments);
    } catch (err) {
        logger.error('Error sending OTP email:', err);
    }
};

module.exports = {
    sendEmail,
    sendNotification,
    sendOtpEmail
};
