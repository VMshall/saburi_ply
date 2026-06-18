const Joi = require('joi');

const getQuotes = {
    query: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string(),
        phone_number: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        from_date: Joi.date().iso(),
        until_date: Joi.date().iso(),
    }),
};

const getQuote = {
    params: Joi.object().keys({
        quoteId: Joi.string(),
    }),
};

const deleteQuote = {
    params: Joi.object().keys({
        quoteId: Joi.string(),
    }),
};

module.exports = {
    getQuotes,
    getQuote,
    deleteQuote,
};
