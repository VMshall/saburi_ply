const contactService = require('../../services/contact.service');
const logger = require('../../utils/logger');
const catchAsync = require('../../utils/catchAsync');

/*
 * Contact Controller
 * Purpose: Handles incoming HTTP requests for Contact Us.
 */

const createContact = catchAsync(async (req, res) => {
    const contact = await contactService.createContact(req.body);
    logger.info(`New Contact Us submission from ${contact.email}`);
    res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: contact
    });
});

module.exports = {
    createContact,
};
