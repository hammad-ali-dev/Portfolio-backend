import type { FastifyInstance } from 'fastify';
import { 
  getExperiencesHandler, 
  createExperienceHandler, 
  updateExperienceHandler, 
  deleteExperienceHandler 
} from './experience.controller';
import { 
  getExperiencesSchema, 
  createExperienceSchema, 
  updateExperienceSchema, 
  deleteExperienceSchema 
} from './experience.schema';
import type { ExperiencePayload } from './experience.type';

export default async function experienceRoutes(fastify: FastifyInstance) {
  
  // 1. Get All Experiences (Public)
  fastify.get('/experiences', { schema: getExperiencesSchema }, getExperiencesHandler);

  // 2. Create Experience (Protected: Admin JWT required)
  fastify.post<{ Body: ExperiencePayload }>('/admin/experiences', {
    schema: createExperienceSchema,
    onRequest: [fastify.authenticate],
  }, createExperienceHandler);

  // 3. Update Experience (Protected: Admin JWT required)
  fastify.put<{ Params: { id: string }; Body: Partial<ExperiencePayload> }>('/admin/experiences/:id', {
    schema: updateExperienceSchema,
    onRequest: [fastify.authenticate],
  }, updateExperienceHandler);

  // 4. Delete Experience (Protected: Admin JWT required)
  fastify.delete<{ Params: { id: string } }>('/admin/experiences/:id', {
    schema: deleteExperienceSchema,
    onRequest: [fastify.authenticate],
  }, deleteExperienceHandler);
}