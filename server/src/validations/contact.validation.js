const Joi = require('joi');

const createContact = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().allow('', null).optional(),
        phone_number: Joi.string().required(), // Stricter regex can be added
        state: Joi.string().required(),
        message: Joi.string().required(),
    }),
};

module.exports = {
    createContact,
};
