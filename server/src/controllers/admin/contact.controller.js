const httpStatus = require('../../constants/httpStatus');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const contactService = require('../../services/contact.crud.service');

const getContacts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'from_date', 'until_date']);
    const result = await contactService.queryContacts(filter, options);
    res.send(result);
});

const getContact = catchAsync(async (req, res) => {
    const contact = await contactService.getContactById(req.params.contactId);
    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
    }
    res.send(contact);
});

const deleteContact = catchAsync(async (req, res) => {
    await contactService.deleteContactById(req.params.contactId);
    res.status(httpStatus.NO_CONTENT).send();
});

const downloadCsv = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await contactService.queryContacts(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'email', 'phone_number', 'state', 'message', 'created_at'];
    const csv = require('../../utils/export').generateCsv(result.results, fields);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.status(httpStatus.OK).send(csv);
});

const downloadPdf = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await contactService.queryContacts(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'email', 'phone_number', 'state', 'message', 'created_at'];
    await require('../../utils/export').generatePdf(result.results, 'Contacts List', res, fields);
});

module.exports = {
    getContacts,
    getContact,
    deleteContact,
    downloadCsv,
    downloadPdf
};
