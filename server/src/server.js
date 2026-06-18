const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const webV1Routes = require('./routes/web/v1');
const adminRoutes = require('./routes/admin');
const { sequelize } = require('./config/database');
const ApiError = require('./utils/ApiError');
const { errorConverter, errorHandler } = require('./middleware/error');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Load environment variables
dotenv.config();

/*
 * Server Configuration
 * Entry point of the backend application
 */

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   ✅ CORS Configuration
======================= */
const corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://localhost:3000',
        'http://localhost:5173',
        'https://saburiply.com',
        'https://www.saburiply.com',
        'https://dev.saburiply.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Apply CORS before other middleware (handles all requests including preflight OPTIONS)
app.use(cors(corsOptions));

// Manually set CORS headers as backup (in case Apache strips them)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:8080',
        'http://localhost:3000',
        'http://localhost:5173',
        'https://saburiply.com',
        'https://www.saburiply.com',
        'https://dev.saburiply.com'
    ];

    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

/* =======================
   Middleware
======================= */
// app.use(helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" }
// })); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
}));

/* =======================
   Routes
======================= */
app.use('/web/v1', webV1Routes);
app.use('/admin', adminRoutes);

/* =======================
   Swagger Docs
======================= */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/* =======================
   Root Route
======================= */
app.get('/', (req, res) => {
    res.json({
        message: 'Saburi Ply API Service is running',
        version: '1.0.0',
        timestamp: new Date()
    });
});

/* =======================
   404 Handler
======================= */
app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'));
});

/* =======================
   Error Handling
======================= */
app.use(errorConverter);
app.use(errorHandler);

/* =======================
   Start Server
======================= */
const startServer = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connection has been established successfully.');

        await sequelize.sync();
        logger.info('Database synchronized');

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
