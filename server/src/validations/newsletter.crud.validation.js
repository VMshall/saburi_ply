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

const getNewsletters = {
    query: Joi.object().keys({
        subject: Joi.string(),
        status: Joi.string().valid('draft', 'sending', 'sent'),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        from_date: Joi.date().iso(),
        until_date: Joi.date().iso(),
    }),
};

const createNewsletter = {
    body: Joi.object().keys({
        subject: Joi.string().required(),
        html_content: Joi.string().required(),
        text_content: Joi.string().optional(),
    }),
};

const updateNewsletter = {
    params: Joi.object().keys({
        newsletterId: Joi.number().integer().required(),
    }),
    body: Joi.object().keys({
        subject: Joi.string(),
        html_content: Joi.string(),
        text_content: Joi.string(),
    }).min(1),
};

const deleteNewsletter = {
    params: Joi.object().keys({
        newsletterId: Joi.number().integer().required(),
    }),
};

const sendNewsletter = {
    params: Joi.object().keys({
        newsletterId: Joi.number().integer().required(),
    }),
};

module.exports = {
    getSubscribers,
    getNewsletters,
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
    sendNewsletter,
};
