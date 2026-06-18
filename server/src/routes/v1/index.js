const express = require('express');
const router = express.Router();

/*
 * V1 Router
 * Purpose: Aggregates all route modules for version 1 of the API.
 * e.g., router.use('/users', userRoutes);
 */

// Health Check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

module.exports = router;
