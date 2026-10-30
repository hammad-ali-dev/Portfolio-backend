import type { FastifyInstance } from 'fastify';
import { 
  getTestimonialsSchema, 
  createTestimonialSchema, 
  getAdminTestimonialsSchema, 
  updateTestimonialApprovalSchema, 
  deleteTestimonialSchema 
} from './review.schema';
import { 
  getTestimonialsHandler, 
  createTestimonialHandler, 
  getAdminTestimonialsHandler, 
  updateTestimonialApprovalHandler, 
  deleteTestimonialHandler 
} from './review.controller';

export default async function testimonialsRoutes(fastify: FastifyInstance) {
  
  // 1. Public: Get all approved testimonials
  fastify.get('/testimonials', { schema: getTestimonialsSchema }, getTestimonialsHandler);

  // 2. Public: Submit a new feedback / testimonial
  fastify.post('/testimonials', { schema: createTestimonialSchema }, createTestimonialHandler);

  // 3. Admin: Get all testimonials (including pending reviews)
  fastify.get('/admin/testimonials', { 
    schema: getAdminTestimonialsSchema, 
    onRequest: [fastify.authenticate] 
  }, getAdminTestimonialsHandler);

  // 4. Admin: Update testimonial approval status (Approve / Reject)
  fastify.patch<{ Params: { id: string }; Body: { is_approved: boolean } }>('/admin/testimonials/:id/approve', { 
    schema: updateTestimonialApprovalSchema, 
    onRequest: [fastify.authenticate] 
  }, updateTestimonialApprovalHandler);

  // 5. Admin: Delete a testimonial
  fastify.delete<{ Params: { id: string } }>('/admin/testimonials/:id', { 
    schema: deleteTestimonialSchema, 
    onRequest: [fastify.authenticate] 
  }, deleteTestimonialHandler);
}