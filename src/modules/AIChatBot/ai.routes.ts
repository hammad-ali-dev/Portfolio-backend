import type { FastifyInstance } from 'fastify';
import { handleAiChatHandler } from './ai.controller';
// Agar koi schema file banani ho toh yahan import kar sakte hain
import { aiChatSchema } from './ai.schema';

export async function aiRoutes(fastify: FastifyInstance) {
  // Public AI Chat Route
  fastify.post<{ Body: { message: string } }>('/chat', {
    schema: aiChatSchema, // Agar validation schema lagana ho
  }, handleAiChatHandler);
}