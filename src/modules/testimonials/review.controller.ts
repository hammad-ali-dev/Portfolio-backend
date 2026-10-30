import type { FastifyReply, FastifyRequest } from "fastify";
import { pool } from "../../config/db";
import { resend } from "../../config/resend"; // <-- Resend client import kiya
import { STATUS_CODES } from "../../constants/statusCodes";

// 1. GET: Fetch all approved testimonials for public display (Public)
export const getTestimonialsHandler = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM testimonials WHERE is_approved = true ORDER BY created_at DESC",
    );

    return reply.status(STATUS_CODES.OK).send(rows);
  } catch (error) {
    return reply
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};

// 2. POST: Submit a new feedback / testimonial (Public + Resend Email)
export const createTestimonialHandler = async (
  request: any,
  reply: FastifyReply,
) => {
  const {
    name,
    email,
    role,
    company = null,
    project_tag = null,
    content,
    rating = 5,
  } = request.body;

  try {
    // 1. Database mein feedback insert karein
    const query = `
      INSERT INTO testimonials (name, email, role, company, project_tag, content, rating, is_approved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, false)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      name,
      email,
      role,
      company,
      project_tag,
      content,
      rating,
    ]);
    const newTestimonial = rows[0];

    // 2. User ko Resend ke zariye automated Thank You email bhejein
    if (email) {
      try {
        await resend.emails.send({
          from: "Hammad Portfolio <onboarding@resend.dev>", // Free testing domain
          to: email,
          subject: "Thank you for your feedback! 🚀",
          html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background: #0f0f0f; color: #ffffff; border-radius: 16px; border: 1px solid #262626; max-width: 500px; margin: 0 auto;">
    <h2 style="color: #ff6600; margin-top: 0; font-size: 20px;">Thank You, ${name}!</h2>
    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
      Your feedback has been successfully recorded and is currently <strong>pending review</strong>.
    </p>
    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
      After admin verification, your review will be published live on the portfolio website.
    </p>
    <hr style="border: none; border-top: 1px solid #262626; margin: 20px 0;" />
    <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
      Hammad Portfolio Automated Notification System
    </p>
  </div>
`,
        });
        console.log(`Thank you email sent successfully to ${email}`);
      } catch (emailError) {
        // Agar email bhejte waqt error aaye toh console par log karein lekin API response fail na ho
        console.error("Failed to send thank you email via Resend:", emailError);
      }
    }

    return reply.status(STATUS_CODES.CREATED).send({
      message: "Feedback submitted successfully and is pending admin approval.",
      data: newTestimonial,
    });
  } catch (error) {
    return reply
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};

// 3. GET: Fetch all testimonials including pending reviews (Protected - Admin)
export const getAdminTestimonialsHandler = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM testimonials ORDER BY created_at DESC",
    );

    return reply.status(STATUS_CODES.OK).send(rows);
  } catch (error) {
    return reply
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};

// 4. PATCH: Update approval status - Approve/Reject (Protected - Admin)
export const updateTestimonialApprovalHandler = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: { is_approved: boolean };
  }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const { is_approved } = request.body;

  try {
    const query = `
      UPDATE testimonials
      SET is_approved = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [is_approved, id]);

    if (rows.length === 0) {
      return reply
        .status(STATUS_CODES.NOT_FOUND)
        .send({ error: "Testimonial not found" });
    }

    return reply.status(STATUS_CODES.OK).send({
      message: `Testimonial ${is_approved ? "approved" : "rejected"} successfully`,
      data: rows[0],
    });
  } catch (error) {
    return reply
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};

// 5. DELETE: Delete a testimonial (Protected - Admin)
export const deleteTestimonialHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  try {
    const { rows } = await pool.query(
      "DELETE FROM testimonials WHERE id = $1 RETURNING *;",
      [id],
    );

    if (rows.length === 0) {
      return reply
        .status(STATUS_CODES.NOT_FOUND)
        .send({ error: "Testimonial not found" });
    }

    return reply.status(STATUS_CODES.OK).send({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    return reply
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
};
