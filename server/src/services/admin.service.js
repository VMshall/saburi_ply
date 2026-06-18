const httpStatus = require('../constants/httpStatus');
const { User, AuthSession } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendOtpEmail } = require('./email.service');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Password hashing helpers (using Node's built-in crypto.scrypt)
const hashPassword = (password) =>
    new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) return reject(err);
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });

const verifyPassword = (password, hashed) =>
    new Promise((resolve, reject) => {
        const [salt, key] = hashed.split(':');
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) return reject(err);
            resolve(key === derivedKey.toString('hex'));
        });
    });
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.findOne({ where: { email: userBody.email } })) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const toCreate = { ...userBody };

    // Hash password if provided
    if (toCreate.password) {
        toCreate.password_hash = await hashPassword(toCreate.password);
        delete toCreate.password;
    }

    return User.create(toCreate);
};

/**
 * Login with OTP (requires valid password first)
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 */
const loginOtp = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check for Lockout
    if (user.lock_until && new Date() < user.lock_until) {
        throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Account locked. Try again later.');
    }

    if (!user.password_hash) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Password login not configured for this account');
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
        user.login_attempts += 1;
        if (user.login_attempts >= 4) {
            user.lock_until = new Date(Date.now() + 60 * 60 * 1000); // 1 hour lockout
        }
        await user.save();
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiry 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp_code = otp;
    user.otp_expires_at = expiresAt;
    await user.save();

    await sendOtpEmail(email, otp);
};

/**
 * Forgot password: send OTP without requiring current password
 * @param {string} email
 * @returns {Promise<void>}
 */
const forgotPassword = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.lock_until && new Date() < user.lock_until) {
        throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Account locked. Try again later.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp_code = otp;
    user.otp_expires_at = expiresAt;
    await user.save();

    await sendOtpEmail(email, otp);
};

/**
 * Reset password using OTP (forgot password flow)
 * @param {string} email
 * @param {string} otp
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (email, otp, newPassword) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Respect existing lockout rules
    if (user.lock_until && new Date() < user.lock_until) {
        throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Account locked. Try again later.');
    }

    // Validate OTP
    if (user.otp_code !== otp) {
        user.login_attempts += 1;

        if (user.login_attempts >= 4) {
            user.lock_until = new Date(Date.now() + 60 * 60 * 1000); // 1 hour lockout
        }

        await user.save();
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
    }

    if (!user.otp_expires_at || new Date() > user.otp_expires_at) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired');
    }

    // Hash and set the new password
    user.password_hash = await hashPassword(newPassword);

    // Clear OTP + reset attempts/lock
    user.otp_code = null;
    user.otp_expires_at = null;
    user.login_attempts = 0;
    user.lock_until = null;
    await user.save();

    // Revoke all active sessions for this user for security
    await AuthSession.update(
        { status: 'revoked' },
        { where: { user_id: user.id, status: 'active' } }
    );
};

/**
 * Verify Forgot Password OTP
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<void>}
 */
const verifyForgotPasswordOtp = async (email, otp) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check for Lockout
    if (user.lock_until && new Date() < user.lock_until) {
        throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Account locked. Try again later.');
    }

    // Check OTP
    if (user.otp_code !== otp) {
        // Increment attempts
        user.login_attempts += 1;

        if (user.login_attempts >= 4) {
            user.lock_until = new Date(Date.now() + 60 * 60 * 1000); // 1 hour lockout
        }

        await user.save();
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
    }

    if (new Date() > user.otp_expires_at) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired');
    }

    // OTP is valid. We do NOT clear it here, because the resetPassword step needs it.
    // Or we could return a temporary token. But current flow seems to rely on OTP being present for reset.
    // The resetPassword function checks OTP again.
};

/**
 * Verify OTP
 * @param {string} email
 * @param {string} otp
 * @param {Object} [metadata] - ip_address, user_agent
 * @returns {Promise<Object>}
 */
const verifyOtp = async (email, otp, metadata = {}) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check for Lockout
    if (user.lock_until && new Date() < user.lock_until) {
        throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Account locked. Try again later.');
    }

    // Check OTP
    if (user.otp_code !== otp) {
        // Increment attempts
        user.login_attempts += 1;

        if (user.login_attempts >= 4) {
            user.lock_until = new Date(Date.now() + 60 * 60 * 1000); // 1 hour lockout
        }

        await user.save();
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
    }

    if (new Date() > user.otp_expires_at) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired');
    }

    // Clear OTP and Reset Attempts
    user.otp_code = null;
    user.otp_expires_at = null;
    user.login_attempts = 0;
    user.lock_until = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
        {
            sub: `u_${user.id}_${crypto.randomUUID().slice(0, 8)}`,
            scope: user.role === 'admin' ? 'admin' : 'user'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Create Session
    await AuthSession.create({
        user_id: user.id,
        token: token,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ip_address: metadata.ip_address,
        user_agent: metadata.user_agent,
    });

    return { user, token };
};

/**
 * Login with email & password
 * @param {string} email
 * @param {string} password
 * @param {Object} [metadata] - ip_address, user_agent
 * @returns {Promise<Object>}
 */
const login = async (email, password, metadata = {}) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Optional: respect lockout logic, similar to OTP flow
    if (user.lock_until && new Date() < user.lock_until) {
        throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Account locked. Try again later.');
    }

    if (!user.password_hash) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Password login not configured for this account');
    }

    const isMatch = await verifyPassword(password, user.password_hash);

    if (!isMatch) {
        user.login_attempts += 1;
        if (user.login_attempts >= 4) {
            user.lock_until = new Date(Date.now() + 60 * 60 * 1000); // 1 hour lockout
        }
        await user.save();
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    // Reset attempts and lock
    user.login_attempts = 0;
    user.lock_until = null;
    await user.save();

    const token = jwt.sign(
        {
            sub: `u_${user.id}_${crypto.randomUUID().slice(0, 8)}`,
            scope: user.role === 'admin' ? 'admin' : 'user'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    await AuthSession.create({
        user_id: user.id,
        token,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ip_address: metadata.ip_address,
        user_agent: metadata.user_agent
    });

    return { user, token };
};

const logout = async (token) => {
    const session = await AuthSession.findOne({ where: { token, status: 'active' } });
    if (session) {
        session.status = 'revoked';
        await session.save();
    }
};

module.exports = {
    createUser,
    loginOtp,
    verifyOtp,
    logout,
    login,
    forgotPassword,
    forgotPassword,
    resetPassword,
    verifyForgotPasswordOtp
};
