const { Subscriber, Newsletter, NewsletterJob, sequelize } = require('../models');
const { Op } = require('sequelize');
const httpStatus = require('../constants/httpStatus');
const ApiError = require('../utils/ApiError');

/**
 * Query for subscribers
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
 * Query for newsletters
 */
const queryNewsletters = async (filter, options) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = options.limit === null ? null : (parseInt(options.limit, 10) || 10);
    const offset = limit ? (page - 1) * limit : null;
    const order = options.sortBy ? [options.sortBy.split(':')] : [['created_at', 'DESC']];

    const queryFilter = { ...filter };
    if (filter.subject) {
        queryFilter.subject = { [Op.like]: `%${filter.subject}%` };
    }
    if (options.from_date && options.until_date) {
        queryFilter.created_at = { [Op.between]: [new Date(options.from_date), new Date(options.until_date)] };
    } else if (options.from_date) {
        queryFilter.created_at = { [Op.gte]: new Date(options.from_date) };
    } else if (options.until_date) {
        queryFilter.created_at = { [Op.lte]: new Date(options.until_date) };
    }

    const { count, rows } = await Newsletter.findAndCountAll({
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

const createNewsletter = async (newsletterBody) => {
    return Newsletter.create(newsletterBody);
};

const updateNewsletterById = async (newsletterId, updateBody) => {
    const newsletter = await Newsletter.findByPk(newsletterId);
    if (!newsletter) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Newsletter not found');
    }
    if (newsletter.status !== 'draft') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only draft newsletters can be updated');
    }
    Object.assign(newsletter, updateBody);
    await newsletter.save();
    return newsletter;
};

const deleteNewsletterById = async (newsletterId) => {
    const newsletter = await Newsletter.findByPk(newsletterId);
    if (!newsletter) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Newsletter not found');
    }
    await newsletter.destroy();
    return newsletter;
};

const sendNewsletter = async (newsletterId) => {
    const newsletter = await Newsletter.findByPk(newsletterId);
    if (!newsletter) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Newsletter not found');
    }
    if (newsletter.status !== 'draft') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Newsletter already sent or sending');
    }

    const emailService = require('./email.service');
    const logger = require('../utils/logger');

    // 1. Get all active subscribers
    const subscribers = await Subscriber.findAll({ where: { status: 'active' } });

    if (subscribers.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No active subscribers found');
    }

    // 2. Update status to sending
    newsletter.status = 'sending';
    await newsletter.save();

    // 3. Send emails directly (Sequential for small lists, consider timeouts for huge ones)
    (async () => {
        let successCount = 0;
        let failCount = 0;

        for (const sub of subscribers) {
            try {
                // Create tracking job
                const trackingJob = await NewsletterJob.create({
                    newsletter_id: newsletter.id,
                    subscriber_id: sub.id,
                    status: 'queued'
                });

                await emailService.sendEmail(sub.email, newsletter.subject, newsletter.html_content);

                trackingJob.status = 'sent';
                trackingJob.sent_at = new Date();
                await trackingJob.save();
                successCount++;
            } catch (error) {
                logger.error(`Direct send failed for ${sub.email}:`, error);
                failCount++;
                // Update tracking job to failed if it was created
                const failedJob = await NewsletterJob.findOne({
                    where: { newsletter_id: newsletter.id, subscriber_id: sub.id, status: 'queued' }
                });
                if (failedJob) {
                    failedJob.status = 'failed';
                    failedJob.error = error.message;
                    await failedJob.save();
                }
            }
        }

        newsletter.status = 'sent';
        await newsletter.save();
        logger.info(`Newsletter ${newsletterId} finished. Success: ${successCount}, Failed: ${failCount}`);
    })();

    return {
        message: `Newsletter sending started for ${subscribers.length} subscribers`,
        total: subscribers.length
    };
};

module.exports = {
    querySubscribers,
    queryNewsletters,
    createNewsletter,
    updateNewsletterById,
    deleteNewsletterById,
    sendNewsletter,
};
