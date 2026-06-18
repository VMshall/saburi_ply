const { Quote, sequelize } = require('../models');
const emailService = require('./email.service');
const logger = require('../utils/logger');

/*
 * Create Quote Service
 * Purpose: Handles the business logic for creating a new quote request.
 * Now includes Transactional Atomic integrity.
 * @param {Object} data - Cleaned data from the controller.
 * @returns {Promise<Object>} - The created quote instance.
 */
const createQuote = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        const quote = await Quote.create(data, { transaction });

        await transaction.commit();

        // Send email notification (non-blocking)
        emailService.sendNotification('quote', quote).catch(err => {
            logger.error('Failed to send quote notification email in background:', err);
        });

        return quote;
    } catch (error) {
        await transaction.rollback();
        logger.error('Transaction failed for createQuote:', error);
        throw error;
    }
};

module.exports = {
    createQuote,
};
