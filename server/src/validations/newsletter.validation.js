const Joi = require('joi');

const subscribe = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
    }),
};

module.exports = {
    subscribe,
};
