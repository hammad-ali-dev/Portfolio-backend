import { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../../config/db';
import { STATUS_CODES } from '../../constants/statusCodes';
import { 
  ProjectBody, 
  ProjectResponse, 
  GetProjectsQuery, 
  PaginatedProjectsResponse 
} from './projects.types';

export async function getProjectsHandler(
  request: FastifyRequest<{ Querystring: GetProjectsQuery }>,
  reply: FastifyReply
) {
  try {
    const page = parseInt(request.query.page || '1', 10);
    const limit = parseInt(request.query.limit || '10', 10);
    const offset = (page - 1) * limit;
    const search = request.query.search?.trim() || '';

    let baseQuery = 'FROM projects WHERE is_deleted = false';
    const queryParams: any[] = [];

    // Agar search query maujood hai
    if (search) {
      queryParams.push(`%${search}%`);
      baseQuery += ` AND (title ILIKE $${queryParams.length} OR description ILIKE $${queryParams.length})`;
    }

    // 1. Total count nikalna pagination ke liye
    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    // 2. Paginated rows fetch karna
   queryParams.push(limit, offset);
    const dataQuery = `
      SELECT * ${baseQuery} 
      ORDER BY created_at DESC 
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
    `;
    const { rows } = await pool.query<ProjectResponse>(dataQuery, queryParams);
    // Type-safe paginated response structure
    const responseData: PaginatedProjectsResponse = {
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

export async function createProjectHandler(
  request: FastifyRequest<{ Body: ProjectBody }>,
  reply: FastifyReply
) {
  const { title, description, tech_stack, github_url, live_url, image_url } = request.body;

  try {
    const query = `
      INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [title, description, tech_stack || [], github_url || null, live_url || null, image_url || null];
    const { rows } = await pool.query<ProjectResponse>(query, values);

    return reply.status(STATUS_CODES.CREATED).send({
      message: 'Project created successfully',
      project: rows[0],
    });
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}

export async function updateProjectHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: ProjectBody }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const { title, description, tech_stack, github_url, live_url, image_url } = request.body;

  try {
    const query = `
      UPDATE projects 
      SET title = $1, description = $2, tech_stack = $3, github_url = $4, live_url = $5, image_url = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [title, description, tech_stack || [], github_url || null, live_url || null, image_url || null, id];
    const { rows } = await pool.query<ProjectResponse>(query, values);

    if (rows.length === 0) {
      return reply.status(STATUS_CODES.NOT_FOUND).send({ error: 'Project not found' });
    }

    return reply.status(STATUS_CODES.OK).send({
      message: 'Project updated successfully',
      project: rows[0],
    });
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}

export async function deleteProjectHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const { rowCount } = await pool.query(
      'UPDATE projects SET is_deleted = true WHERE id = \$1 AND is_deleted = false',
      [id]
    );

    if (rowCount === 0) {
      return reply.status(STATUS_CODES.NOT_FOUND).send({ error: 'Project not found' });
    }

    return reply.status(STATUS_CODES.OK).send({ message: 'Project deleted successfully' });
  } catch (error) {
    request.server.log.error(error);
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
}