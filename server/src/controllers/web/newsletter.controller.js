const httpStatus = require('../../constants/httpStatus');
const catchAsync = require('../../utils/catchAsync');
const newsletterService = require('../../services/newsletter.service');

const subscribe = catchAsync(async (req, res) => {
    await newsletterService.subscribe(req.body.email);
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Successfully subscribed to newsletter'
    });
});

module.exports = {
    subscribe,
};
