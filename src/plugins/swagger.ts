import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
  // 1. Register Swagger (OpenAPI Specification)
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Portfolio & Admin Backend API',
        description: 'API documentation for Portfolio projects and Admin authentication',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development Server',
        },
      ],
      // Yeh section aapke Bearer Token (JWT) ko Swagger UI mein authorize button ke sath link karega
      components: {
        securitySchemes: {
          Bearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token as: Bearer <your_token>',
          },
        },
      },
    },
  });

  // 2. Register Swagger UI (Documentation Browser Page)
  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs', // Browser mein http://localhost:5000/docs par open hoga
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
});