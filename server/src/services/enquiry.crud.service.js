const { Enquiry } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');

const queryEnquiries = async (filter, options) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = options.limit === null ? null : (parseInt(options.limit, 10) || 10);
    const offset = limit ? (page - 1) * limit : null;
    const order = options.sortBy ? [options.sortBy.split(':')] : [['created_at', 'DESC']];

    const queryFilter = { ...filter };
    const textFields = ['name', 'email', 'phone_number', 'state', 'city', 'product', 'message'];
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

    const { count, rows } = await Enquiry.findAndCountAll({
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

const getEnquiryById = async (id) => {
    return Enquiry.findByPk(id);
};

const deleteEnquiryById = async (id) => {
    const enquiry = await getEnquiryById(id);
    if (!enquiry) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Enquiry not found');
    }
    await enquiry.destroy();
    return enquiry;
};

module.exports = {
    queryEnquiries,
    getEnquiryById,
    deleteEnquiryById,
};
