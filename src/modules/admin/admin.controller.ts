import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { pool } from '../../config/db';
import { STATUS_CODES } from '../../constants/statusCodes';
import { LoginBody, AdminModel } from './admin.types';

// 1. Admin Login Handler
export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const { email, password_hash } = request.body;

  try {
    const { rows } = await pool.query<AdminModel>('SELECT * FROM admins WHERE email = $1', [email]);

    if (rows.length === 0) {
      return reply.status(STATUS_CODES.UNAUTHORIZED).send({ error: 'Invalid email or password' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password_hash, admin.password_hash);

    if (!isMatch) {
      return reply.status(STATUS_CODES.UNAUTHORIZED).send({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = request.server.jwt.sign({ id: admin.id, email: admin.email });

    return reply.status(STATUS_CODES.OK).send({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}

// 2. Admin Logout Handler
export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    return reply.status(STATUS_CODES.OK).send({
      message: 'Logged out successfully',
    });
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}