import type { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../../config/db'; // Apne db pool ka path check kar lein
import { STATUS_CODES } from '../../constants/statusCodes';
import type { ExperiencePayload } from './experience.type';

// 1. GET: Fetch all experiences (Public)
export const getExperiencesHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await pool.query(
      'SELECT * FROM experiences ORDER BY order_index ASC, created_at ASC'
    );
    return reply.status(STATUS_CODES.OK).send(result.rows);
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};

// 2. POST: Create Experience (Protected)
export const createExperienceHandler = async (
  request: FastifyRequest<{ Body: ExperiencePayload }>, 
  reply: FastifyReply
) => {
  const { title, company, duration, location, description, order_index = 0 } = request.body;

  try {
    const query = `
      INSERT INTO experiences (title, company, duration, location, description, order_index)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      title, 
      company, 
      duration, 
      location, 
      description, 
      order_index
    ]);

    return reply.status(STATUS_CODES.CREATED).send({
      message: 'Experience created successfully',
      data: rows[0],
    });
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};

// 3. PUT: Update Experience (Protected)
export const updateExperienceHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: Partial<ExperiencePayload> }>, 
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { title, company, duration, location, description, order_index } = request.body;

  try {
    // Dynamic query builder ya standard update query
    const query = `
      UPDATE experiences 
      SET 
        title = COALESCE($1, title),
        company = COALESCE($2, company),
        duration = COALESCE($3, duration),
        location = COALESCE($4, location),
        description = COALESCE($5, description),
        order_index = COALESCE($6, order_index)
      WHERE id = $7
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      title, 
      company, 
      duration, 
      location, 
      description, 
      order_index, 
      id
    ]);

    if (rows.length === 0) {
      return reply.status(STATUS_CODES.NOT_FOUND).send({ error: 'Experience not found' });
    }

    return reply.status(STATUS_CODES.OK).send({
      message: 'Experience updated successfully',
      data: rows[0],
    });
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};

// 4. DELETE: Delete Experience (Protected)
export const deleteExperienceHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>, 
  reply: FastifyReply
) => {
  const { id } = request.params;

  try {
    const { rows } = await pool.query('DELETE FROM experiences WHERE id = \$1 RETURNING *;', [id]);

    if (rows.length === 0) {
      return reply.status(STATUS_CODES.NOT_FOUND).send({ error: 'Experience not found' });
    }

    return reply.status(STATUS_CODES.OK).send({
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};