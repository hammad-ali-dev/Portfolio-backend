export const getSkillsSchema = {
  description: 'Fetch all skill categories along with their grouped skills (Public)',
  tags: ['Skills'],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          icon_name: { type: 'string' },
          order_index: { type: 'number' },
          created_at: { type: 'string' },
          skills: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                category_id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                order_index: { type: 'number' },
                created_at: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const createSkillCategorySchema = {
  description: 'Create a new skill category (Protected)',
  tags: ['Skills'],
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string', minLength: 2 },
      icon_name: { type: 'string' },
      order_index: { type: 'number' },
    },
  },
};

export const createSkillSchema = {
  description: 'Add a new skill under a category (Protected)',
  tags: ['Skills'],
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['category_id', 'name'],
    properties: {
      category_id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      order_index: { type: 'number' },
    },
  },
};