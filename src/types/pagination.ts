export default class PaginationRequestFilters {
  limit?: number;
  skip?: number;
  sort?: string;
  search?: string;
}

export interface PaginationResponseFilters {
  skip: number;
  limit: number;
  search: string;
  total: number;
  received: number;
}

export interface PaginationResponseData<T> {
  data: T[];
  filters: PaginationResponseFilters;
}

export const DEFAULT_PAGINATION_REQUEST_DTO: PaginationRequestFilters = {
  limit: 10,
  skip: 0,
  sort: 'createdAt:desc',
  search: '',
};
