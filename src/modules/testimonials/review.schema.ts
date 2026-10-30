// 1. Public: Get All Approved Testimonials
export const getTestimonialsSchema = {
  description: 'Fetch all approved testimonials for public display (Public)',
  tags: ['Testimonials'],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' }, // <-- Yahan email add ki
          role: { type: 'string' },
          company: { type: 'string', nullable: true },
          project_tag: { type: 'string', nullable: true },
          content: { type: 'string' },
          rating: { type: 'integer' },
          created_at: { type: 'string' },
        },
      },
    },
  },
};

// 2. Public: Submit a New Feedback / Testimonial
export const createTestimonialSchema = {
  description: 'Submit a new feedback or testimonial for approval (Public)',
  tags: ['Testimonials'],
  body: {
    type: 'object',
    required: ['name', 'email', 'role', 'content'], // <-- email ko required mein dala
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' }, // <-- email validation add ki
      role: { type: 'string', minLength: 2 },
      company: { type: 'string', nullable: true },
      project_tag: { type: 'string', nullable: true },
      content: { type: 'string', minLength: 10 },
      rating: { type: 'integer', minimum: 1, maximum: 5, default: 5 },
    },
  },
};

// 3. Admin: Get All Testimonials (Including Pending Reviews)
export const getAdminTestimonialsSchema = {
  description: 'Fetch all testimonials including pending reviews (Protected)',
  tags: ['Admin Testimonials'],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' }, // <-- Yahan bhi email add ki
          role: { type: 'string' },
          company: { type: 'string', nullable: true },
          project_tag: { type: 'string', nullable: true },
          content: { type: 'string' },
          rating: { type: 'integer' },
          is_approved: { type: 'boolean' },
          created_at: { type: 'string' },
        },
      },
    },
  },
};

// 4. Admin: Update Approval Status (Approve / Reject)
export const updateTestimonialApprovalSchema = {
  description: 'Approve or reject a client testimonial (Protected)',
  tags: ['Admin Testimonials'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' },
    },
  },
  body: {
    type: 'object',
    required: ['is_approved'],
    properties: {
      is_approved: { type: 'boolean' },
    },
  },
};

// 5. Admin: Delete a Testimonial
export const deleteTestimonialSchema = {
  description: 'Delete a testimonial by ID (Protected)',
  tags: ['Admin Testimonials'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' },
    },
  },
};