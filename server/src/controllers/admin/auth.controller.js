const httpStatus = require('../../constants/httpStatus');
const catchAsync = require('../../utils/catchAsync');
const adminService = require('../../services/admin.service');

const createUser = catchAsync(async (req, res) => {
    const user = await adminService.createUser(req.body);
    res.status(httpStatus.CREATED).send({ success: true, message: 'User created successfully', user });
});

const loginOtp = catchAsync(async (req, res) => {
    await adminService.loginOtp(req.body.email, req.body.password);
    res.status(httpStatus.OK).send({ success: true, message: 'OTP sent to your email' });
});

const verifyOtp = catchAsync(async (req, res) => {
    const metadata = {
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
    };
    const { user, token } = await adminService.verifyOtp(req.body.email, req.body.otp, metadata);
    res.status(httpStatus.OK).send({ success: true, message: 'Login successful', token, user });
});

const login = catchAsync(async (req, res) => {
    const metadata = {
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
    };
    const { user, token } = await adminService.login(req.body.email, req.body.password, metadata);
    res.status(httpStatus.OK).send({ success: true, message: 'Login successful', token, user });
});

const getMe = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send({ success: true, message: 'User retrieved successfully', user: req.user });
});

const logout = catchAsync(async (req, res) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    await adminService.logout(token);
    res.status(httpStatus.OK).send({ success: true, message: 'Logged out successfully' });
});

const verifyForgotPasswordOtp = catchAsync(async (req, res) => {
    await adminService.verifyForgotPasswordOtp(req.body.email, req.body.otp);
    res.status(httpStatus.OK).send({ success: true, message: 'OTP verified successfully' });
});

const resetPassword = catchAsync(async (req, res) => {
    await adminService.resetPassword(req.body.email, req.body.otp, req.body.password);
    res.status(httpStatus.OK).send({ success: true, message: 'Password has been reset successfully' });
});

module.exports = {
    createUser,

    loginOtp,
    verifyOtp,
    logout,
    getMe,
    getMe,
    login,
    verifyForgotPasswordOtp,
    resetPassword
};
