const { Enquiry, sequelize } = require('../models');
const emailService = require('./email.service');
const logger = require('../utils/logger');

/*
 * Create Enquiry Service
 * Purpose: Handles the business logic for creating a new enquiry entry.
 * @param {Object} data - Cleaned data from the controller.
 * @returns {Promise<Object>} - The created enquiry instance.
 */
const createEnquiry = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        const enquiry = await Enquiry.create(data, { transaction });

        // Commit transaction only if DB write succeeds
        await transaction.commit();

        // Send email notification (non-blocking)
        emailService.sendNotification('enquiry', enquiry).catch(err => {
            logger.error('Failed to send enquiry notification email in background:', err);
        });

        return enquiry;
    } catch (error) {
        await transaction.rollback();
        logger.error('Transaction failed for createEnquiry:', error);
        throw error;
    }
};

module.exports = {
    createEnquiry,
};
