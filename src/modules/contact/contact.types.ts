export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactMessagePayload {
  id: string;          
  created_at: string;  
  is_read: boolean;    
}

// 1. Pagination metadata type (Projects ki tarah)
export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// 2. Paginated GET response type for messages
export interface PaginatedMessagesResponse {
  data: ContactMessage[];
  pagination: PaginationMeta;
}

// 3. Query parameters type for GET messages (Search & Pagination)
export interface GetMessagesQuery {
  page?: string;
  limit?: string;
  search?: string;
}