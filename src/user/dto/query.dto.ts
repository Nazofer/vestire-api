import PaginationRequestFilters from '@/types/pagination';

export class PaginationRequestDto implements PaginationRequestFilters {
  limit?: number;
  skip?: number;
  sort?: string;
  search?: string;
}
