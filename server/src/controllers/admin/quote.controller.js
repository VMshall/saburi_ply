const httpStatus = require('../../constants/httpStatus');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const quoteService = require('../../services/quote.crud.service');

const getQuotes = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'phone_number']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'from_date', 'until_date']);
    const result = await quoteService.queryQuotes(filter, options);
    res.send(result);
});

const getQuote = catchAsync(async (req, res) => {
    const quote = await quoteService.getQuoteById(req.params.quoteId);
    if (!quote) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Quote not found');
    }
    res.send(quote);
});

const deleteQuote = catchAsync(async (req, res) => {
    await quoteService.deleteQuoteById(req.params.quoteId);
    res.status(httpStatus.NO_CONTENT).send();
});

const downloadCsv = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'phone_number']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await quoteService.queryQuotes(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'email', 'phone_number', 'company_name', 'inquiry_type', 'product_type', 'estimated_qty', 'created_at'];
    const csv = require('../../utils/export').generateCsv(result.results, fields);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=quotes.csv');
    res.status(httpStatus.OK).send(csv);
});

const downloadPdf = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'phone_number']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await quoteService.queryQuotes(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'email', 'phone_number', 'company_name', 'inquiry_type', 'product_type', 'estimated_qty', 'created_at'];
    await require('../../utils/export').generatePdf(result.results, 'Quotes List', res, fields);
});

module.exports = {
    getQuotes,
    getQuote,
    deleteQuote,
    downloadCsv,
    downloadPdf
};
