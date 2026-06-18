const Joi = require('joi');

const getSaveDatas = {
    query: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string(),
        phone_number: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        from_date: Joi.date(),
        until_date: Joi.date(),
    }),
};

const getSaveData = {
    params: Joi.object().keys({
        saveDataId: Joi.string().required(),
    }),
};

const deleteSaveData = {
    params: Joi.object().keys({
        saveDataId: Joi.string().required(),
    }),
};

module.exports = {
    getSaveDatas,
    getSaveData,
    deleteSaveData,
};
