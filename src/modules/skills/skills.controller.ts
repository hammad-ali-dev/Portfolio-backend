import type { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../../config/db';
import { STATUS_CODES } from '../../constants/statusCodes';
import type { SkillCategoryWithSkills } from './skills.types';

// 1. GET: Fetch all categories and grouped skills (Public)
export const getSkillsHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const categoriesResult = await pool.query(
      'SELECT * FROM skill_categories ORDER BY order_index ASC, created_at ASC'
    );
    const categories = categoriesResult.rows;

    const skillsResult = await pool.query(
      'SELECT * FROM skills ORDER BY order_index ASC, created_at ASC'
    );
    const skills = skillsResult.rows;

    const groupedData: SkillCategoryWithSkills[] = categories.map((cat) => ({
      ...cat,
      skills: skills.filter((skill) => skill.category_id === cat.id),
    }));

    return reply.status(STATUS_CODES.OK).send(groupedData);
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};

// 2. POST: Create Skill Category (Protected)
export const createSkillCategoryHandler = async (request: any, reply: FastifyReply) => {
  const { title, icon_name, order_index = 0 } = request.body;

  try {
    const query = `
      INSERT INTO skill_categories (title, icon_name, order_index)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [title, icon_name, order_index]);

    return reply.status(STATUS_CODES.CREATED).send({
      message: 'Skill category created successfully',
      data: rows[0],
    });
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};

// 3. POST: Add Skill to Category (Protected)
export const createSkillHandler = async (request: any, reply: FastifyReply) => {
  const { category_id, name, order_index = 0 } = request.body;

  try {
    const query = `
      INSERT INTO skills (category_id, name, order_index)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [category_id, name, order_index]);

    return reply.status(STATUS_CODES.CREATED).send({
      message: 'Skill added successfully',
      data: rows[0],
    });
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};

// 4. DELETE: Delete a Skill (Protected)
export const deleteSkillHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;

  try {
    const { rows } = await pool.query('DELETE FROM skills WHERE id = \$1 RETURNING *;', [id]);

    if (rows.length === 0) {
      return reply.status(STATUS_CODES.NOT_FOUND).send({ error: 'Skill not found' });
    }

    return reply.status(STATUS_CODES.OK).send({
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};