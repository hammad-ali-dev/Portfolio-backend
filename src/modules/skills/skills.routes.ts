import type { FastifyInstance } from 'fastify';
import { 
  getSkillsSchema, 
  createSkillCategorySchema, 
  createSkillSchema 
} from './skills.schema';
import { 
  getSkillsHandler, 
  createSkillCategoryHandler, 
  createSkillHandler, 
  deleteSkillHandler 
} from './skills.controller';
import type { SkillCategoryPayload, SkillPayload } from './skills.types';

export default async function skillsRoutes(fastify: FastifyInstance) {
  
  fastify.get('/skills', { schema: getSkillsSchema }, getSkillsHandler);

 
  fastify.post<{ Body: SkillCategoryPayload }>('/admin/skill-categories', {
    schema: createSkillCategorySchema,
    onRequest: [fastify.authenticate],
  }, createSkillCategoryHandler);

 
  fastify.post<{ Body: SkillPayload }>('/admin/skills', {
    schema: createSkillSchema,
    onRequest: [fastify.authenticate],
  }, createSkillHandler);

 
  fastify.delete<{ Params: { id: string } }>('/admin/skills/:id', {
    onRequest: [fastify.authenticate],
  }, deleteSkillHandler);
}