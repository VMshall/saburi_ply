const { BecomePartner, sequelize } = require('../models');
const emailService = require('./email.service');
const logger = require('../utils/logger');

/*
 * Create Partner Service
 * Purpose: Handles the business logic for creating a new partner inquiry.
 * Now includes Transactional Atomic integrity.
 * @param {Object} data - Cleaned data from the controller.
 * @returns {Promise<Object>} - The created partner instance.
 */
const createPartner = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        const partner = await BecomePartner.create(data, { transaction });

        await transaction.commit();

        // Send email notification (non-blocking)
        emailService.sendNotification('partner', partner).catch(err => {
            logger.error('Failed to send partner notification email in background:', err);
        });

        return partner;
    } catch (error) {
        await transaction.rollback();
        logger.error('Transaction failed for createPartner:', error);
        throw error;
    }
};

module.exports = {
    createPartner,
};
