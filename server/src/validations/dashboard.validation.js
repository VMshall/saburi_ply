const Joi = require('joi');

const getRecentSubmissions = {
    query: Joi.object().keys({
        limit: Joi.number().integer().default(10),
        page: Joi.number().integer().default(1),
        from_date: Joi.date().iso(),
        until_date: Joi.date().iso(),
    }),
};

module.exports = {
    getRecentSubmissions,
};
