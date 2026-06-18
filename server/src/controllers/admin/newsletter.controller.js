const httpStatus = require('../../constants/httpStatus');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const newsletterAdminService = require('../../services/newsletter.admin.service');

const getSubscribers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['email', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'from_date', 'until_date']);
    const result = await newsletterAdminService.querySubscribers(filter, options);
    res.send(result);
});

const getNewsletters = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['subject', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'from_date', 'until_date']);
    const result = await newsletterAdminService.queryNewsletters(filter, options);
    res.send(result);
});

const createNewsletter = catchAsync(async (req, res) => {
    const newsletter = await newsletterAdminService.createNewsletter(req.body);
    res.status(httpStatus.CREATED).send(newsletter);
});

const updateNewsletter = catchAsync(async (req, res) => {
    const newsletter = await newsletterAdminService.updateNewsletterById(req.params.newsletterId, req.body);
    res.send(newsletter);
});

const deleteNewsletter = catchAsync(async (req, res) => {
    await newsletterAdminService.deleteNewsletterById(req.params.newsletterId);
    res.status(httpStatus.NO_CONTENT).send();
});

const sendNewsletter = catchAsync(async (req, res) => {
    const result = await newsletterAdminService.sendNewsletter(req.params.newsletterId);
    res.send(result);
});

const downloadSubscribersCsv = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['email', 'status']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await newsletterAdminService.querySubscribers(filter, { ...options, limit: null });
    const fields = ['id', 'email', 'status', 'created_at', 'unsubscribed_at'];
    const csv = require('../../utils/export').generateCsv(result.results, fields);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.status(httpStatus.OK).send(csv);
});

const downloadSubscribersPdf = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['email', 'status']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await newsletterAdminService.querySubscribers(filter, { ...options, limit: null });
    const fields = ['id', 'email', 'status', 'created_at', 'unsubscribed_at'];
    await require('../../utils/export').generatePdf(result.results, 'Newsletter Subscribers', res, fields);
});

module.exports = {
    getSubscribers,
    getNewsletters,
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
    sendNewsletter,
    downloadSubscribersCsv,
    downloadSubscribersPdf,
};
