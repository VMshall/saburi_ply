const Joi = require('joi');

const createQuote = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().allow('', null).optional(),
        phone_number: Joi.string().required(),
        company_name: Joi.string().allow(null, ''),
        inquiry_type: Joi.string().required(),
        product_type: Joi.string().allow(null, ''),
        estimated_qty: Joi.string().allow(null, ''),
        additional_requirements: Joi.string().allow(null, ''),
    }),
};

module.exports = {
    createQuote,
};
