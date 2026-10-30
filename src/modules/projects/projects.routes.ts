import type { FastifyInstance } from 'fastify';
import { 
  getProjectsSchema, 
  manageProjectSchema, 
  updateProjectSchema, 
  deleteProjectSchema 
} from './projects.schema';
import { 
  getProjectsHandler, 
  createProjectHandler, 
  updateProjectHandler, 
  deleteProjectHandler 
} from './projects.controller';
import type { ProjectBody, GetProjectsQuery } from './projects.types';

export default async function projectRoutes(fastify: FastifyInstance) {
  // 1. Get Projects (Public)
  fastify.get<{ Querystring: GetProjectsQuery }>('/projects', { 
    schema: getProjectsSchema 
  }, getProjectsHandler);

  // 2. Create Project (Protected)
  fastify.post<{ Body: ProjectBody }>('/admin/projects', {
    schema: manageProjectSchema,
    onRequest: [fastify.authenticate],
  }, createProjectHandler);

  // 3. Update Project (Protected)
  fastify.put<{ Params: { id: string }; Body: ProjectBody }>('/admin/projects/:id', {
    schema: updateProjectSchema,
    onRequest: [fastify.authenticate],
  }, updateProjectHandler);

  // 4. Delete Project (Protected)
  fastify.delete<{ Params: { id: string } }>('/admin/projects/:id', {
    schema: deleteProjectSchema,
    onRequest: [fastify.authenticate],
  }, deleteProjectHandler);
}