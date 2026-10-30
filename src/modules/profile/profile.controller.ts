import type { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../../config/db'; // Apne db pool ka path check kar lein
import { STATUS_CODES } from '../../constants/statusCodes';
import type { ProfilePayload } from './profile.types';

// 1. GET: Fetch Profile details (Public - Single Row)
export const getProfileHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await pool.query('SELECT * FROM profile ORDER BY updated_at DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return reply.status(STATUS_CODES.NOT_FOUND).send({ error: 'Profile not found' });
    }

    return reply.status(STATUS_CODES.OK).send(result.rows[0]);
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};

// 2. PUT: Create or Update Profile (Protected - Upsert pattern)
export const updateProfileHandler = async (
  request: FastifyRequest<{ Body: ProfilePayload }>, 
  reply: FastifyReply
) => {
  const { 
    title, 
    subtitle, 
    bio_primary, 
    bio_secondary, 
    location, 
    degree, 
    experience_role, 
    university, 
    graduation_years, 
    hobbies, 
    tech_stack 
  } = request.body;

  try {
    // Check if a profile record already exists
    const existing = await pool.query('SELECT id FROM profile LIMIT 1');

    let result;
    if (existing.rows.length > 0) {
      // Update existing profile
      const query = `
        UPDATE profile 
        SET 
          title = COALESCE($1, title),
          subtitle = COALESCE($2, subtitle),
          bio_primary = COALESCE($3, bio_primary),
          bio_secondary = COALESCE($4, bio_secondary),
          location = COALESCE($5, location),
          degree = COALESCE($6, degree),
          experience_role = COALESCE($7, experience_role),
          university = COALESCE($8, university),
          graduation_years = COALESCE($9, graduation_years),
          hobbies = COALESCE($10, hobbies),
          tech_stack = COALESCE($11, tech_stack),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *;
      `;
      result = await pool.query(query, [
        title, 
        subtitle, 
        bio_primary, 
        bio_secondary, 
        location, 
        degree, 
        experience_role, 
        university, 
        graduation_years, 
        hobbies, 
        tech_stack,
        existing.rows[0].id
      ]);
    } else {
      // Insert new profile if none exists
      const query = `
        INSERT INTO profile (
          title, subtitle, bio_primary, bio_secondary, location, 
          degree, experience_role, university, graduation_years, hobbies, tech_stack
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;
      result = await pool.query(query, [
        title, 
        subtitle, 
        bio_primary, 
        bio_secondary, 
        location, 
        degree, 
        experience_role, 
        university, 
        graduation_years, 
        hobbies, 
        tech_stack
      ]);
    }

    return reply.status(STATUS_CODES.OK).send({
      message: 'Profile updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    return reply.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
};