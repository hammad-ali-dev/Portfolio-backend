import { FastifyInstance } from 'fastify';
import { loginHandler, logoutHandler } from './admin.controller';
import { loginSchema } from './admin.schema';

export async function authRoutes(server: FastifyInstance) {
  // Public Login Route
  server.post('/auth/login', { schema: loginSchema }, loginHandler);
  server.post('/auth/logout',{ preHandler: [server.authenticate],},logoutHandler);
}