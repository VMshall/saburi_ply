const httpStatus = require('../../constants/httpStatus');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const saveDataService = require('../../services/saveData.crud.service');

const getSaveDatas = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'phone_number']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'from_date', 'until_date']);
    const result = await saveDataService.querySaveData(filter, options);
    res.send(result);
});

const getSaveData = catchAsync(async (req, res) => {
    const saveData = await saveDataService.getSaveDataById(req.params.saveDataId);
    if (!saveData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'SaveData not found');
    }
    res.send(saveData);
});

const deleteSaveData = catchAsync(async (req, res) => {
    await saveDataService.deleteSaveDataById(req.params.saveDataId);
    res.status(httpStatus.NO_CONTENT).send();
});

const downloadCsv = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'phone_number']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await saveDataService.querySaveData(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'email', 'phone_number', 'created_at'];
    const csv = require('../../utils/export').generateCsv(result.results, fields);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=save_data.csv');
    res.status(httpStatus.OK).send(csv);
});

const downloadPdf = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'email', 'phone_number']);
    const options = pick(req.query, ['from_date', 'until_date']);
    const result = await saveDataService.querySaveData(filter, { ...options, limit: null });
    const fields = ['id', 'name', 'email', 'phone_number', 'created_at'];
    await require('../../utils/export').generatePdf(result.results, 'Save Data List', res, fields);
});

module.exports = {
    getSaveDatas,
    getSaveData,
    deleteSaveData,
    downloadCsv,
    downloadPdf
};
