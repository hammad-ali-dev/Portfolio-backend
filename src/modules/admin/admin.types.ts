export interface LoginBody {
  email: string;
  password_hash: string; // Plain password input from admin
}

export interface AdminModel {
  id: string; // UUID
  email: string;
  password_hash: string;
  created_at: Date;
}