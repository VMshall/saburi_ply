const { User, AuthSession } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
    const existingUser = await User.findOne({ where: { email: userBody.email } });
    if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userBody);
};

const queryUsers = async (filter, options) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = options.limit === null ? null : (parseInt(options.limit, 10) || 10);
    const offset = limit ? (page - 1) * limit : null;
    const order = options.sortBy ? [options.sortBy.split(':')] : [['createdAt', 'DESC']];

    const queryFilter = { ...filter };
    const textFields = ['name', 'email'];
    textFields.forEach((field) => {
        if (filter[field]) {
            queryFilter[field] = { [Op.like]: `%${filter[field]}%` };
        }
    });
    if (options.from_date && options.until_date) {
        queryFilter.createdAt = { [Op.between]: [new Date(options.from_date), new Date(options.until_date)] };
    } else if (options.from_date) {
        queryFilter.createdAt = { [Op.gte]: new Date(options.from_date) };
    } else if (options.until_date) {
        queryFilter.createdAt = { [Op.lte]: new Date(options.until_date) };
    }

    const { count, rows } = await User.findAndCountAll({
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

const getUserById = async (id) => {
    return User.findByPk(id);
};

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.findOne({ where: { email: updateBody.email } })) && user.email !== updateBody.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

const deleteUserById = async (id) => {
    const user = await getUserById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    // First delete auth_session
    await AuthSession.destroy({ where: { user_id: id } });
    // then user 
    await user.destroy();
    return user;
};

module.exports = {
    createUser,
    queryUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};
