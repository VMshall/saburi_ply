const { SaveData } = require('../models');

const createSaveData = async (dataBody) => {
    return SaveData.create(dataBody);
};

module.exports = {
    createSaveData,
};
