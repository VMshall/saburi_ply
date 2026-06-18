const Joi = require('joi');

const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        from_date: Joi.date().iso(),
        until_date: Joi.date().iso(),
    }),
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string(),
    }),
};

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        role: Joi.string().required().valid('user', 'admin'),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            email: Joi.string().email(),
            role: Joi.string().valid('user', 'admin'),
        })
        .min(1),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string(),
    }),
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
