const httpStatus = require('../../constants/httpStatus');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const subscriberService = require('../../services/subscriber.crud.service');

const getSubscribers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['email', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'from_date', 'until_date']);
    const result = await subscriberService.querySubscribers(filter, options);
    res.send(result);
});

const createSubscriber = catchAsync(async (req, res) => {
    const subscriber = await subscriberService.createSubscriber(req.body);
    res.status(httpStatus.CREATED).send(subscriber);
});

const deleteSubscriber = catchAsync(async (req, res) => {
    await subscriberService.deleteSubscriberById(req.params.subscriberId);
    res.status(httpStatus.NO_CONTENT).send();
});

const downloadCsv = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['email', 'status']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await subscriberService.querySubscribers(filter, { ...options, limit: null });
    const fields = ['id', 'email', 'status', 'created_at', 'unsubscribed_at'];
    const csv = require('../../utils/export').generateCsv(result.results, fields);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.status(httpStatus.OK).send(csv);
});

const downloadPdf = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['email', 'status']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await subscriberService.querySubscribers(filter, { ...options, limit: null });
    const fields = ['id', 'email', 'status', 'created_at', 'unsubscribed_at'];
    await require('../../utils/export').generatePdf(result.results, 'Subscribers List', res, fields);
});

module.exports = {
    getSubscribers,
    createSubscriber,
    deleteSubscriber,
    downloadCsv,
    downloadPdf,
};
