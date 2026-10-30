import { pool } from '../../config/db'; 

let cachedWebsiteData: string | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 Minutes Cache

export const getLiveWebsiteData = async (): Promise<string> => {
  const now = Date.now();

  // Cache Check
  if (cachedWebsiteData && now - lastFetchTime < CACHE_DURATION) {
    return cachedWebsiteData;
  }

  try {
    console.log('[AI Service] Fetching live website data from PostgreSQL DB...');

    // Parallel queries - sirf active (non-deleted) projects fetch honge
    const [profileRes, projectsRes, skillsRes, experiencesRes] = await Promise.all([
      pool.query('SELECT * FROM profile LIMIT 1'),
      pool.query('SELECT * FROM projects WHERE is_deleted = false OR is_deleted IS NULL'),
      pool.query('SELECT * FROM skills'),
      pool.query('SELECT * FROM experiences'),
    ]);

    const profile = profileRes.rows[0] || {};
    const projects = projectsRes.rows || [];
    const skills = skillsRes.rows || [];
    const experiences = experiencesRes.rows || [];

    const formattedContent = `
PROFILE INFORMATION:
Name: ${profile.name || 'Hammad'}
Title: ${profile.title || 'Associate Software Engineer'}
Bio: ${profile.bio || 'Specializing in React, React Native, TypeScript, Fastify, and PostgreSQL.'}
Location: ${profile.location || 'N/A'}

SKILLS & EXPERTISE:
${skills.map((s) => `- ${s.name}${s.category ? ` (${s.category})` : ''}`).join('\n')}

WORK EXPERIENCES:
${experiences
  .map(
    (e) =>
      `- Role: ${e.role || e.title} at ${e.company} (${e.duration || 'N/A'})\n  Description: ${e.description}`
  )
  .join('\n')}

FEATURED PROJECTS:
${projects
  .map((p) => {
    // Handling tech_stack column across Array, String, or JSON formats
    let formattedTechStack = 'N/A';
    
    if (Array.isArray(p.tech_stack)) {
      formattedTechStack = p.tech_stack.filter(Boolean).join(', ');
    } else if (typeof p.tech_stack === 'string') {
      formattedTechStack = p.tech_stack;
    } else if (p.tech_stack) {
      formattedTechStack = JSON.stringify(p.tech_stack);
    }

    return `- Title: ${p.title}\n  Description: ${p.description}\n  Tech Stack: ${formattedTechStack}`;
  })
  .join('\n')}
`.trim();

    cachedWebsiteData = formattedContent;
    lastFetchTime = now;
    return cachedWebsiteData;
  } catch (error) {
    console.warn('[AIService Warning] Could not fetch DB data:', error);
  }

  return (
    cachedWebsiteData ||
    "Hammad is an Associate Software Engineer specializing in React, React Native, TypeScript, Fastify, and PostgreSQL."
  );
};

// Database update par cache clear karne ke liye helper function
export const clearAiCache = () => {
  cachedWebsiteData = null;
  lastFetchTime = 0;
};