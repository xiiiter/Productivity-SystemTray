// frontend/types/api_types.ts

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface DateRange {
  start: string;
  end: string;
}

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export interface SortParams {
  field: string;
  order: SortOrder;
}