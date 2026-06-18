const Joi = require('joi');

const getContacts = {
    query: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        from_date: Joi.date().iso(),
        until_date: Joi.date().iso(),
    }),
};

const getContact = {
    params: Joi.object().keys({
        contactId: Joi.string(),
    }),
};

const deleteContact = {
    params: Joi.object().keys({
        contactId: Joi.string(),
    }),
};

module.exports = {
    getContacts,
    getContact,
    deleteContact,
};
