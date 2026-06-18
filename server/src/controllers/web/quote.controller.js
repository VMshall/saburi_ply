const quoteService = require('../../services/quote.service');
const logger = require('../../utils/logger');
const catchAsync = require('../../utils/catchAsync');

/*
 * Quote Controller
 * Purpose: Handles incoming HTTP requests for Quote requests.
 */

const createQuote = catchAsync(async (req, res) => {
    const quote = await quoteService.createQuote(req.body);
    logger.info(`New Quote request from ${quote.email}`);
    res.status(201).json({
        success: true,
        message: 'Quote request submitted successfully',
        data: quote
    });
});

module.exports = {
    createQuote,
};
