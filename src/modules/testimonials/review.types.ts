export interface Testimonial {
  id: number;
  name: string;
  email: string; 
  role: string;
  company: string | null;
  project_tag: string | null;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: Date;
}

// Jab public user modal se form submit karega
export type CreateTestimonialInput = {
  name: string;
  email: string; 
  role: string;
  company?: string;
  project_tag?: string;
  content: string;
  rating: number;
};

// Jab admin approval status update karega
export type UpdateTestimonialApprovalInput = {
  is_approved: boolean;
};