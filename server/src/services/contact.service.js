const { ContactUs, sequelize } = require('../models');
const emailService = require('./email.service');
const logger = require('../utils/logger');

/*
 * Create Contact Service
 * Purpose: Handles the business logic for creating a new contact entry.
 * Now includes Transactional Atomic integrity.
 * @param {Object} data - Cleaned data from the controller.
 * @returns {Promise<Object>} - The created contact instance.
 */
const createContact = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        const contact = await ContactUs.create(data, { transaction });

        // Commit transaction only if DB write succeeds
        await transaction.commit();

        // Send email notification (non-blocking)
        emailService.sendNotification('contact', contact).catch(err => {
            logger.error('Failed to send contact notification email in background:', err);
        });

        return contact;
    } catch (error) {
        await transaction.rollback();
        logger.error('Transaction failed for createContact:', error);
        throw error;
    }
};

module.exports = {
    createContact,
};
