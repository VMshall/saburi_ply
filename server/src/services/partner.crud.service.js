const { BecomePartner, sequelize } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');

/**
 * Query for partners
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.from_date] - Start date
 * @param {string} [options.until_date] - End date
 * @returns {Promise<Object>}
 */
const queryPartners = async (filter, options) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = options.limit === null ? null : (parseInt(options.limit, 10) || 10);
    const offset = limit ? (page - 1) * limit : null;
    const order = options.sortBy ? [options.sortBy.split(':')] : [['created_at', 'DESC']];

    const queryFilter = { ...filter };
    const textFields = ['name', 'firm_name', 'city', 'contact_number', 'email', 'project_type', 'message', 'partner_type'];
    textFields.forEach((field) => {
        if (filter[field]) {
            queryFilter[field] = { [Op.like]: `%${filter[field]}%` };
        }
    });
    if (options.from_date && options.until_date) {
        queryFilter.created_at = { [Op.between]: [new Date(options.from_date), new Date(options.until_date)] };
    } else if (options.from_date) {
        queryFilter.created_at = { [Op.gte]: new Date(options.from_date) };
    } else if (options.until_date) {
        queryFilter.created_at = { [Op.lte]: new Date(options.until_date) };
    }

    const { count, rows } = await BecomePartner.findAndCountAll({
        where: queryFilter,
        limit: limit === null ? undefined : limit,
        offset: offset === null ? undefined : offset,
        order,
    });

    return {
        results: rows,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        totalResults: count,
    };
};

/**
 * Get partner by id
 * @param {ObjectId} id
 * @returns {Promise<BecomePartner>}
 */
const getPartnerById = async (id) => {
    return BecomePartner.findByPk(id);
};

/**
 * Delete partner by id
 * @param {ObjectId} id
 * @returns {Promise<BecomePartner>}
 */
const deletePartnerById = async (id) => {
    const partner = await getPartnerById(id);
    if (!partner) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Partner not found');
    }
    await partner.destroy();
    return partner;
};

module.exports = {
    queryPartners,
    getPartnerById,
    deletePartnerById,
};
