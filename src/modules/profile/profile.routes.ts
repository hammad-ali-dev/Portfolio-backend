import type { FastifyInstance } from 'fastify';
import { 
  getProfileHandler, 
  updateProfileHandler 
} from './profile.controller';
import { 
  getProfileSchema, 
  updateProfileSchema 
} from './profile.schema';
import type { ProfilePayload } from './profile.types';

export default async function profileRoutes(fastify: FastifyInstance) {
  
  // 1. Get Profile Details (Public)
  fastify.get('/profile', { schema: getProfileSchema }, getProfileHandler);

  // 2. Create or Update Profile (Protected: Admin JWT required)
  fastify.put<{ Body: ProfilePayload }>('/admin/profile', {
    schema: updateProfileSchema,
    onRequest: [fastify.authenticate],
  }, updateProfileHandler);
}