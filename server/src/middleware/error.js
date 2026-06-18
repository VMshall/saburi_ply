const { Sequelize } = require('sequelize');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const httpStatus = require('http-status'); // Optional, but using strings/numbers for now is fine

/*
 * Error Converter
 * Purpose: Ensures any error thrown in the app is converted to an ApiError
 * so it has a proper status code and message.
 */
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || (error instanceof Sequelize.Error ? 400 : 500);
        const message = error.message || (statusCode === 500 ? 'Internal Server Error' : 'Error');
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

/*
 * Error Handler
 * Purpose: The final middleware that sends the formatted error response to the client.
 */
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = 500;
        message = 'Internal Server Error';
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorHandler,
};
