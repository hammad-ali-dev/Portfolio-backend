export const loginSchema = {
  description: 'Admin Login to get JWT Token for dashboard management',
  tags: ['Auth'],
  body: {
    type: 'object',
    required: ['email', 'password_hash'],
    properties: {
      email: { type: 'string', format: 'email' },
      password_hash: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        token: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};