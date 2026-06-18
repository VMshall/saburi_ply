const Joi = require('joi');

const createPartner = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        firm_name: Joi.string().required(),
        city: Joi.string().required(),
        contact_number: Joi.string().required(),
        email: Joi.string().email().allow('', null).optional(),
        project_type: Joi.string().required(),
        message: Joi.string().required(),
        partner_type: Joi.string().valid('INTERIOR_DESIGNER', 'ARCHITECT', 'DEALERSHIP').required(),
    }),
};

module.exports = {
    createPartner,
};
