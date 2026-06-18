const { AuthSession, User } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const httpStatus = require('../constants/httpStatus');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }

    // 1. Verify signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Find active session (DO NOT trust JWT for user id)
    const session = await AuthSession.findOne({
      where: { token, status: 'active' }
    });

    if (!session) {
      logger.warn(`Session not found for token: ${token.slice(0, 12)}...`);
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Session expired or revoked');
    }

    // 3. Load real user
    const user = await User.findByPk(session.user_id);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    // 4. Attach
    req.user = user;
    req.session = session;
    req.jwt = decoded;

    next();
  } catch (error) {
    logger.error('Auth Middleware Error:', error);

    if (error instanceof ApiError) return next(error);

    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token expired'));
    }

    next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
};

module.exports = auth;
