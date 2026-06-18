const { Subscriber } = require('../models');
const { Op } = require('sequelize');
const httpStatus = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

/**
 * Query for subscribers
 * @param {Object} filter - Search filter
 * @param {Object} options - Query options (sortBy, limit, page, from_date, until_date)
 * @returns {Promise<Object>}
 */
const querySubscribers = async (filter, options) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = options.limit === null ? null : (parseInt(options.limit, 10) || 10);
    const offset = limit ? (page - 1) * limit : null;
    const order = options.sortBy ? [options.sortBy.split(':')] : [['created_at', 'DESC']];

    const queryFilter = { ...filter };
    if (filter.email) {
        queryFilter.email = { [Op.like]: `%${filter.email}%` };
    }

    if (options.from_date && options.until_date) {
        queryFilter.created_at = { [Op.between]: [new Date(options.from_date), new Date(options.until_date)] };
    } else if (options.from_date) {
        queryFilter.created_at = { [Op.gte]: new Date(options.from_date) };
    } else if (options.until_date) {
        queryFilter.created_at = { [Op.lte]: new Date(options.until_date) };
    }

    const { count, rows } = await Subscriber.findAndCountAll({
        where: queryFilter,
        limit: limit === null ? undefined : limit,
        offset: offset === null ? undefined : offset,
        order,
    });

    return {
        results: rows,
        page,
        limit,
        totalPages: limit ? Math.ceil(count / limit) : 1,
        totalResults: count,
    };
};

/**
 * Create a subscriber
 * @param {Object} subscriberBody
 * @returns {Promise<Subscriber>}
 */
const createSubscriber = async (subscriberBody) => {
    if (await Subscriber.findOne({ where: { email: subscriberBody.email } })) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already subscribed');
    }
    return Subscriber.create(subscriberBody);
};

/**
 * Delete subscriber by id
 * @param {number} subscriberId
 * @returns {Promise<Subscriber>}
 */
const deleteSubscriberById = async (subscriberId) => {
    const subscriber = await Subscriber.findByPk(subscriberId);
    if (!subscriber) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Subscriber not found');
    }
    await subscriber.destroy();
    return subscriber;
};

module.exports = {
    querySubscribers,
    createSubscriber,
    deleteSubscriberById,
};
