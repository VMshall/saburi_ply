const Joi = require('joi');

const getEnquiries = {
    query: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string(),
        product: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        from_date: Joi.date().iso(),
        until_date: Joi.date().iso(),
    }),
};

const getEnquiry = {
    params: Joi.object().keys({
        enquiryId: Joi.string(),
    }),
};

const deleteEnquiry = {
    params: Joi.object().keys({
        enquiryId: Joi.string(),
    }),
};

module.exports = {
    getEnquiries,
    getEnquiry,
    deleteEnquiry,
};
