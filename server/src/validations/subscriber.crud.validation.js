const Joi = require('joi');

const getSubscribers = {
    query: Joi.object().keys({
        email: Joi.string(),
        status: Joi.string().valid('pending', 'active', 'unsubscribed', 'bounced'),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        from_date: Joi.date().iso(),
        until_date: Joi.date().iso(),
    }),
};

const createSubscriber = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        status: Joi.string().valid('pending', 'active', 'unsubscribed', 'bounced'),
    }),
};

const deleteSubscriber = {
    params: Joi.object().keys({
        subscriberId: Joi.number().integer().required(),
    }),
};

module.exports = {
    getSubscribers,
    createSubscriber,
    deleteSubscriber,
};
