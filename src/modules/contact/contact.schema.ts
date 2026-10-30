export const createContactSchema = {
  description: 'Submit a new contact message from portfolio visitor',
  tags: ['Contact'],
  body: {
    type: 'object',
    required: ['name', 'email', 'subject', 'message'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      subject: { type: 'string', minLength: 3 },
      message: { type: 'string', minLength: 10 },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
            subject: { type: 'string' },
            message: { type: 'string' },
            created_at: { type: 'string' },
            is_read: { type: 'boolean' },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const getAdminMessagesSchema = {
  description: 'Fetch paginated contact messages for admin dashboard (Protected)',
  tags: ['Contact'],
  security: [{ bearerAuth: [] }],
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
              name: { type: 'string' },
              email: { type: 'string' },
              subject: { type: 'string' },
              message: { type: 'string' },
              created_at: { type: 'string' },
              is_read: { type: 'boolean' },
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

export const getAdminNotificationsSchema = {
  description: 'Fetch unread contact notifications for admin popover (Protected)',
  tags: ['Contact'],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string' },
          subject: { type: 'string' },
          message: { type: 'string' },
          created_at: { type: 'string' },
          is_read: { type: 'boolean' },
        },
      },
    },
  },
};