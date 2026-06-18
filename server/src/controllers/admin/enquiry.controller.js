const httpStatus = require('../../constants/httpStatus');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const enquiryService = require('../../services/enquiry.crud.service');

const getEnquiries = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'product']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'from_date', 'until_date']);
    const result = await enquiryService.queryEnquiries(filter, options);
    res.send(result);
});

const getEnquiry = catchAsync(async (req, res) => {
    const enquiry = await enquiryService.getEnquiryById(req.params.enquiryId);
    if (!enquiry) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Enquiry not found');
    }
    res.send(enquiry);
});

const deleteEnquiry = catchAsync(async (req, res) => {
    await enquiryService.deleteEnquiryById(req.params.enquiryId);
    res.status(httpStatus.NO_CONTENT).send();
});

const downloadCsv = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'product']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await enquiryService.queryEnquiries(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'email', 'phone_number', 'state', 'city', 'product', 'message', 'created_at'];
    const csv = require('../../utils/export').generateCsv(result.results, fields);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=enquiries.csv');
    res.status(httpStatus.OK).send(csv);
});

const downloadPdf = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'product']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await enquiryService.queryEnquiries(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'email', 'phone_number', 'state', 'city', 'product', 'created_at'];
    await require('../../utils/export').generatePdf(result.results, 'Enquiry List', res, fields);
});

module.exports = {
    getEnquiries,
    getEnquiry,
    deleteEnquiry,
    downloadCsv,
    downloadPdf
};
