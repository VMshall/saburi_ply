const enquiryService = require('../../services/enquiry.service');
const logger = require('../../utils/logger');
const catchAsync = require('../../utils/catchAsync');

/*
 * Enquiry Controller
 * Purpose: Handles incoming HTTP requests for Product Enquiries.
 */

const createEnquiry = catchAsync(async (req, res) => {
    const enquiry = await enquiryService.createEnquiry(req.body);
    logger.info(`New Product Enquiry submission from ${enquiry.email}`);
    res.status(201).json({
        success: true,
        message: 'Enquiry sent successfully',
        data: enquiry
    });
});

module.exports = {
    createEnquiry,
};
