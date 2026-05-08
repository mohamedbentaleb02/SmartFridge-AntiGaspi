const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartFridge AntiGaspi API',
      version: '1.0.0',
      description: 'Backend API for reducing food waste with smart fridge management',
      contact: {
        name: 'SmartFridge Team',
        email: 'contact@smartfridge.com'
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
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
  apis: ['./src/routes/*.js'], // ADD THIS LINE - required by swaggerJsdoc
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};