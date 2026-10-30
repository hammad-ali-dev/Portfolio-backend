export interface ExperiencePayload {
  title: string;
  company: string;
  duration: string;
  location: string;
  description: string[];
  order_index?: number;
}

export interface Experience extends ExperiencePayload {
  id: string;
  created_at: string;
}