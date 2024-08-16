import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scissors URL Shortener API',
      version: '1.0.0',
      description: 'API documentation for the Scissors URL Shortener service',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', 
      },
    ],
  },
  apis: ['./src/routes/url.ts', './src/models/urlModel.ts', './src/controllers/urlController.ts', './src/index.ts'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

export default app;
