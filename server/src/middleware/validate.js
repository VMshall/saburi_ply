const Joi = require('joi');
const logger = require('../utils/logger');

/*
 * Validation Middleware
 * Purpose: Validates the request data (body, query, params) against a provided Joi schema.
 * It ensures that data entering the controllers is clean and follows the expected format.
 * Returns a 400 Bad Request if validation fails.
 */

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));

    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        logger.warn(`Validation Error: ${errorMessage}`);
        return res.status(400).json({
            error: {
                message: 'Validation Error',
                details: errorMessage
            }
        });
    }

    // Transform empty strings to null to satisfy Sequelize's allowNull validation
    const transformedValue = JSON.parse(JSON.stringify(value), (key, val) =>
        val === '' ? null : val
    );

    Object.assign(req, transformedValue);
    return next();
};

/*
 * Helper to pick keys from object
 */
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

module.exports = validate;
