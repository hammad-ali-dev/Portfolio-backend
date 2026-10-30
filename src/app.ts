import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import projectRoutes from './modules/projects/projects.routes';
import { authRoutes } from './modules/admin/admin.routes';
import contactRoutes from './modules/contact/contact.routes';
import skillsRoutes from './modules/skills/skills.routes';
import experienceRoutes from './modules/experiences/experience.routes';
import profileRoutes from './modules/profile/profile.routes'; 
import testimonialsRoutes from './modules/testimonials/review.routes';
import { aiRoutes } from './modules/AIChatBot/ai.routes'; // <-- AI Routes import karein
dotenv.config();

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  // 1. Plugins & JWT Register karein
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey',
  });

  // 2. Authenticate Decorator define karein
  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ error: 'Unauthorized Access' });
    }
  });

  // 3. Routes Register karein
  app.register(authRoutes);

  app.register(projectRoutes, { prefix: '/api' });
  app.register(contactRoutes, { prefix: '/api' });
  app.register(skillsRoutes, { prefix: '/api' });
  app.register(experienceRoutes, { prefix: '/api' });
  app.register(profileRoutes, { prefix: '/api' });
  app.register(testimonialsRoutes, { prefix: '/api' });
  app.register(aiRoutes, { prefix: '/api/ai' }); 
  return app;
}