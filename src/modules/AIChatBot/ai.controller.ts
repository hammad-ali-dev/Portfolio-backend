import type { FastifyReply, FastifyRequest } from "fastify";
import { Groq } from "groq-sdk";
import { STATUS_CODES } from "../../constants/statusCodes";
import { getLiveWebsiteData } from "./ai.service";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatRequestBody {
  message: string;
}

export const handleAiChatHandler = async (
  request: FastifyRequest<{ Body: ChatRequestBody }>,
  reply: FastifyReply,
) => {
  const { message } = request.body;

  if (!message || message.trim() === "") {
    return reply
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ error: "Message is required" });
  }

  try {
    const siteContent = await getLiveWebsiteData();

    const prompt = `
You are the official AI Assistant on Hammad's portfolio website. 
Answer visitor questions politely, professionally, and accurately using ONLY the live website content provided below.

================ LIVE WEBSITE DATA ================
${siteContent}
===================================================

USER QUESTION: ${message}

INSTRUCTIONS:
1. Base your answer directly on the live website data.
2. PROJECT QUERIES RULE:
   - If the user asks generally about projects (e.g., "what projects do you have?", "projects list", "show projects"), ONLY list the project names as clean bullet points and ask which one they would like to know more about. Do NOT show full descriptions or tech stack initially.
   - If the user asks about a SPECIFIC project by name (e.g., "tell me about Sunday app"), then provide its full details, description, and tech stack in a clear format.
3. Keep initial list responses very brief and concise.
4. If asked about something not present in the data, kindly advise the user to contact Hammad via the website's Contact Form.
5. Reply in the same language the user asks.
`.trim();
    let aiReply = "";

    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b", // Groq ka active lightweight & super-fast model
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      aiReply = completion.choices[0]?.message?.content || "";
    } catch (err) {
      request.log.warn(
        { err },
        "[AI Service] Groq API request failed, using fallback response.",
      );
    }

    if (!aiReply) {
      aiReply =
        "I am currently receiving a high volume of queries. Please feel free to ask again in a moment or contact Hammad directly via the Contact Form!";
    }

    return reply.status(STATUS_CODES.OK).send({
      reply: aiReply,
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(STATUS_CODES.OK).send({
      reply:
        "I am having a brief connection delay. Please ask your question again in just a moment!",
    });
  }
}; 