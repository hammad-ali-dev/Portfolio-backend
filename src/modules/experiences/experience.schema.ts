export const getExperiencesSchema = {
  description: 'Get all professional experiences (Public)',
  tags: ['Experience'],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          company: { type: 'string' },
          duration: { type: 'string' },
          location: { type: 'string' },
          description: { type: 'array', items: { type: 'string' } },
          order_index: { type: 'number' },
          created_at: { type: 'string' },
        },
      },
    },
  },
};

export const createExperienceSchema = {
  description: 'Create a new experience item (Protected: Admin JWT required)',
  tags: ['Experience - Admin Dashboard'],
  security: [{ Bearer: [] }],
  body: {
    type: 'object',
    required: ['title', 'company', 'duration', 'location', 'description'],
    properties: {
      title: { type: 'string' },
      company: { type: 'string' },
      duration: { type: 'string' },
      location: { type: 'string' },
      description: { type: 'array', items: { type: 'string' } },
      order_index: { type: 'number' },
    },
  },
};

export const updateExperienceSchema = {
  description: 'Update an existing experience item (Protected: Admin JWT required)',
  tags: ['Experience - Admin Dashboard'],
  security: [{ Bearer: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      company: { type: 'string' },
      duration: { type: 'string' },
      location: { type: 'string' },
      description: { type: 'array', items: { type: 'string' } },
      order_index: { type: 'number' },
    },
  },
};

export const deleteExperienceSchema = {
  description: 'Delete an experience item (Protected: Admin JWT required)',
  tags: ['Experience - Admin Dashboard'],
  security: [{ Bearer: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
};