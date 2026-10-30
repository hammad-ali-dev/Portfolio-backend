import type { FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').JWT;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}