const { Subscriber } = require('../models');
const httpStatus = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

/**
 * Subscribe to newsletter
 * @param {string} email
 * @returns {Promise<Subscriber>}
 */
const subscribe = async (email) => {
    const existingSubscriber = await Subscriber.findOne({ where: { email } });

    if (existingSubscriber) {
        if (existingSubscriber.status === 'active') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already subscribed');
        }
        // Reactivate if unsubscribed or pending
        existingSubscriber.status = 'active';
        existingSubscriber.unsubscribed_at = null;
        await existingSubscriber.save();
        return existingSubscriber;
    }

    return Subscriber.create({ email, status: 'active' });
};

module.exports = {
    subscribe,
};
