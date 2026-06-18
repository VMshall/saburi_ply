const partnerService = require('../../services/partner.service');
const logger = require('../../utils/logger');
const catchAsync = require('../../utils/catchAsync');

/*
 * Partner Controller
 * Purpose: Handles incoming HTTP requests for Become a Partner.
 */

const createPartner = catchAsync(async (req, res) => {
    const partner = await partnerService.createPartner(req.body);
    logger.info(`New Partner request from ${partner.email} - ${partner.partner_type}`);
    res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: partner
    });
});

module.exports = {
    createPartner,
};
