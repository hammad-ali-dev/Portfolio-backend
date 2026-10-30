export const getProfileSchema = {
  description: 'Get user profile and about details (Public)',
  tags: ['Profile'],
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        bio_primary: { type: 'string' },
        bio_secondary: { type: 'string' },
        location: { type: 'string' },
        degree: { type: 'string' },
        experience_role: { type: 'string' },
        university: { type: 'string' },
        graduation_years: { type: 'string' },
        hobbies: { type: 'array', items: { type: 'string' } },
        tech_stack: { type: 'array', items: { type: 'string' } },
        updated_at: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};

export const updateProfileSchema = {
  description: 'Create or update profile information (Protected: Admin JWT required)',
  tags: ['Profile - Admin Dashboard'],
  security: [{ Bearer: [] }],
  body: {
    type: 'object',
    required: [
      'title',
      'subtitle',
      'bio_primary',
      'bio_secondary',
      'location',
      'degree',
      'experience_role',
      'university',
      'graduation_years',
      'hobbies',
      'tech_stack',
    ],
    properties: {
      title: { type: 'string' },
      subtitle: { type: 'string' },
      bio_primary: { type: 'string' },
      bio_secondary: { type: 'string' },
      location: { type: 'string' },
      degree: { type: 'string' },
      experience_role: { type: 'string' },
      university: { type: 'string' },
      graduation_years: { type: 'string' },
      hobbies: { type: 'array', items: { type: 'string' } },
      tech_stack: { type: 'array', items: { type: 'string' } },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        profile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            subtitle: { type: 'string' },
            bio_primary: { type: 'string' },
            bio_secondary: { type: 'string' },
            location: { type: 'string' },
            degree: { type: 'string' },
            experience_role: { type: 'string' },
            university: { type: 'string' },
            graduation_years: { type: 'string' },
            hobbies: { type: 'array', items: { type: 'string' } },
            tech_stack: { type: 'array', items: { type: 'string' } },
            updated_at: { type: 'string' },
          },
        },
      },
    },
  },
};