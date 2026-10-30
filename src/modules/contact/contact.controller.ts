import { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../../config/db';
import { STATUS_CODES } from '../../constants/statusCodes';
import { ContactMessagePayload, ContactMessage, GetMessagesQuery, PaginatedMessagesResponse } from './contact.types';

// 1. Submit Contact Message Handler (Public)
export async function createContactHandler(
  request: FastifyRequest<{ Body: ContactMessagePayload }>,
  reply: FastifyReply
) {
  const { name, email, subject, message } = request.body;

  try {
    const query = `
      INSERT INTO contact_messages (name, email, subject, message, is_read)
      VALUES ($1, $2, $3, $4, FALSE)
      RETURNING *;
    `;
    const values = [name, email, subject, message];
    const { rows } = await pool.query(query, values);

    return reply.status(STATUS_CODES.CREATED).send({
      message: 'Message sent successfully',
      data: rows[0],
    });
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}

// 2. Get Admin Messages Handler (Protected - Paginated & Searchable)
export async function getAdminMessagesHandler(
  request: FastifyRequest<{ Querystring: GetMessagesQuery }>,
  reply: FastifyReply
) {
  try {
    const page = parseInt(request.query.page || '1', 10);
    const limit = parseInt(request.query.limit || '10', 10);
    const offset = (page - 1) * limit;
    const search = request.query.search?.trim() || '';

    let baseQuery = 'FROM contact_messages WHERE 1=1';
    const queryParams: any[] = [];

    // Agar search query maujood hai (name, email, ya subject mein search karega)
    if (search) {
      queryParams.push(`%${search}%`);
      baseQuery += ` AND (name ILIKE $${queryParams.length} OR email ILIKE $${queryParams.length} OR subject ILIKE $${queryParams.length})`;
    }

    // 1. Total items count nikalna pagination ke liye
    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    // 2. Paginated data fetch karna
    queryParams.push(limit, offset);
    const dataQuery = `
      SELECT id, name, email, subject, message, created_at, is_read 
      ${baseQuery} 
      ORDER BY created_at DESC 
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
    `;
    const { rows } = await pool.query<ContactMessage>(dataQuery, queryParams);

    const responseData: PaginatedMessagesResponse = {
      data: rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      },
    };

    return reply.status(STATUS_CODES.OK).send(responseData);
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}

// 3. Get Unread Notifications Handler (Protected)
export async function getAdminNotificationsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const query = `
      SELECT id, name, email, subject, message, created_at, is_read 
      FROM contact_messages 
      WHERE is_read = FALSE
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query);

    return reply.status(STATUS_CODES.OK).send(rows);
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}

// 4. Mark Notification as Read Handler (Protected)
export async function markNotificationAsReadHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const query = `
      UPDATE contact_messages 
      SET is_read = TRUE 
      WHERE id = $1 
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return reply.status(STATUS_CODES.NOT_FOUND).send({ error: 'Message not found' });
    }

    return reply.status(STATUS_CODES.OK).send({
      message: 'Notification marked as read',
      data: rows[0],
    });
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}