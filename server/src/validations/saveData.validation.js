const Joi = require('joi');

const createSaveData = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().allow('', null).optional(),
        phone_number: Joi.string().allow('', null).optional()
    }),
};

module.exports = {
    createSaveData,
};
