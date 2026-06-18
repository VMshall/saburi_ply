const httpStatus = require('../../constants/httpStatus');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const partnerService = require('../../services/partner.crud.service');

const getPartners = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'from_date', 'until_date']);
    const result = await partnerService.queryPartners(filter, options);
    res.send(result);
});

const getPartner = catchAsync(async (req, res) => {
    const partner = await partnerService.getPartnerById(req.params.partnerId);
    if (!partner) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Partner not found');
    }
    res.send(partner);
});

const deletePartner = catchAsync(async (req, res) => {
    await partnerService.deletePartnerById(req.params.partnerId);
    res.status(httpStatus.NO_CONTENT).send();
});

const downloadCsv = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await partnerService.queryPartners(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'firm_name', 'email', 'contact_number', 'city', 'partner_type', 'created_at'];
    const csv = require('../../utils/export').generateCsv(result.results, fields);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=partners.csv');
    res.status(httpStatus.OK).send(csv);
});

const downloadPdf = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await partnerService.queryPartners(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'firm_name', 'email', 'contact_number', 'city', 'partner_type', 'created_at'];
    await require('../../utils/export').generatePdf(result.results, 'Partners List', res, fields);
});

module.exports = {
    getPartners,
    getPartner,
    deletePartner,
    downloadCsv,
    downloadPdf
};
