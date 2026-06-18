const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const httpStatus = require('../../constants/httpStatus');
const dashboardService = require('../../services/dashboard.service');

const getDashboardStats = catchAsync(async (req, res) => {
    const stats = await dashboardService.getStats();
    res.status(httpStatus.OK).send({ success: true, stats });
});

const getRecentSubmissions = catchAsync(async (req, res) => {
    const options = pick(req.query, ['limit', 'page', 'from_date', 'until_date']);
    const result = await dashboardService.getRecentSubmissions(options);
    res.status(httpStatus.OK).send({ success: true, ...result });
});

module.exports = {
    getDashboardStats,
    getRecentSubmissions
};
