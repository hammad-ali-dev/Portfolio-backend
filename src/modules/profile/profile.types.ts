export interface Profile {
  id: string; // UUID string
  title: string;
  subtitle: string;
  bio_primary: string;
  bio_secondary: string;
  location: string;
  degree: string;
  experience_role: string;
  university: string;
  graduation_years: string;
  hobbies: string[];
  tech_stack: string[];
  updated_at: string;
}

export interface ProfilePayload {
  title: string;
  subtitle: string;
  bio_primary: string;
  bio_secondary: string;
  location: string;
  degree: string;
  experience_role: string;
  university: string;
  graduation_years: string;
  hobbies: string[];
  tech_stack: string[];
}