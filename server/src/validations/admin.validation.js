const Joi = require('joi');

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'user').default('user')
    })
};

const loginOtp = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
};

const verifyOtp = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required()
    })
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
};

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required()
    })
};

const resetPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
        password: Joi.string().min(6).required()
    })
};

module.exports = {
    createUser,
    loginOtp,
    verifyOtp,
    login,
    forgotPassword,
    resetPassword
};
