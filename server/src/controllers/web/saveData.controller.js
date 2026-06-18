const saveDataService = require('../../services/saveData.service');
const logger = require('../../utils/logger');
const catchAsync = require('../../utils/catchAsync');

const createSaveData = catchAsync(async (req, res) => {
    const saveData = await saveDataService.createSaveData(req.body);
    logger.info(`New Save Data submission`);
    res.status(201).json({
        success: true,
        message: 'Data saved successfully',
        data: saveData
    });
});

module.exports = {
    createSaveData,
};
