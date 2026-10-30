export interface SkillCategoryPayload {
  title: string;
  icon_name?: string;
  order_index?: number;
}

export interface SkillCategory extends SkillCategoryPayload {
  id: string;
  created_at: string;
}

export interface SkillPayload {
  category_id: string;
  name: string;
  order_index?: number;
}

export interface Skill extends SkillPayload {
  id: string;
  created_at: string;
}

// Frontend par categories aur unke andar skills ko group karke show karne ke liye
export interface SkillCategoryWithSkills extends SkillCategory {
  skills: Skill[];
}