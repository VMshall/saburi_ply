const Joi = require('joi');

const createEnquiry = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().allow('', null).optional(),
        phone_number: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().allow('', null).optional(),
        product: Joi.string().allow('', null).optional(),
        message: Joi.string().allow('', null).optional(),
    }),
};

module.exports = {
    createEnquiry,
};
