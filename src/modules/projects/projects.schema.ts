export const getProjectsSchema = {
  description: 'Get paginated and searchable portfolio projects (Public)',
  tags: ['Projects'],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string' },
      limit: { type: 'string' },
      search: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              title: { type: 'string' },
              description: { type: 'string' },
              tech_stack: { type: 'array', items: { type: 'string' } },
              github_url: { type: 'string', nullable: true },
              live_url: { type: 'string', nullable: true },
              image_url: { type: 'string', nullable: true },
              created_at: { type: 'string' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            totalPages: { type: 'number' },
            currentPage: { type: 'number' },
            limit: { type: 'number' },
          },
        },
      },
    },
  },
};

export const manageProjectSchema = {
  description: 'Create a new project (Protected: Admin JWT required)',
  tags: ['Projects - Admin Dashboard'],
  security: [{ Bearer: [] }],
  body: {
    type: 'object',
    required: ['title', 'description'],
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      tech_stack: { type: 'array', items: { type: 'string' } },
      github_url: { type: 'string' },
      live_url: { type: 'string' },
      image_url: { type: 'string' },
    },
  },
};

export const updateProjectSchema = {
  description: 'Update an existing project (Protected: Admin JWT required)',
  tags: ['Projects - Admin Dashboard'],
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
      description: { type: 'string' },
      tech_stack: { type: 'array', items: { type: 'string' } },
      github_url: { type: 'string' },
      live_url: { type: 'string' },
      image_url: { type: 'string' },
    },
  },
};

export const deleteProjectSchema = {
  description: 'Delete a project (Protected: Admin JWT required)',
  tags: ['Projects - Admin Dashboard'],
  security: [{ Bearer: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
};