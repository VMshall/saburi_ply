const Joi = require('joi');

const getPartners = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        from_date: Joi.date().iso(),
        until_date: Joi.date().iso(),
    }),
};

const getPartner = {
    params: Joi.object().keys({
        partnerId: Joi.string(),
    }),
};

const deletePartner = {
    params: Joi.object().keys({
        partnerId: Joi.string(),
    }),
};

module.exports = {
    getPartners,
    getPartner,
    deletePartner,
};
