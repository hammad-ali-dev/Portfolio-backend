export interface ProjectBody {
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
}

export interface ProjectResponse extends ProjectBody {
  id: string; // UUID
  created_at: Date;
  is_deleted: boolean;
}

// 1. Pagination metadata type
export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// 2. Paginated GET response type
export interface PaginatedProjectsResponse {
  data: ProjectResponse[];
  pagination: PaginationMeta;
}

// 3. Query parameters type for GET projects
export interface GetProjectsQuery {
  page?: string;
  limit?: string;
  search?: string;
}