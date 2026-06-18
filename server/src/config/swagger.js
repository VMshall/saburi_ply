const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Saburi Ply API',
            version: '1.1.0',
            description: 'API Documentation for Saburi Ply Backend',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: 'Local server',
            },
            {
                url: 'https://apiv2.saburiply.com/api',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        path.join(__dirname, '../routes/admin/*.js'),
        path.join(__dirname, '../routes/web/v1/*.js')
    ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
