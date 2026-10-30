export const aiChatSchema = {
  description: 'Send a message to the portfolio AI chatbot and get a dynamic response (Public)',
  tags: ['AI Assistant'],
  body: {
    type: 'object',
    required: ['message'],
    properties: {
      message: { 
        type: 'string', 
        minLength: 1, 
        description: 'The question or query asked by the visitor' 
      },
    },
  },
  response: {
    200: {
      description: 'Successful AI response',
      type: 'object',
      properties: {
        reply: { type: 'string', description: 'The generated AI reply based on live portfolio data' },
      },
    },
    400: {
      description: 'Bad Request - Missing message',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    500: {
      description: 'Internal Server Error',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};