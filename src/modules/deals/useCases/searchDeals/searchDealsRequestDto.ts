export interface SearchDealsRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: 'expired' | 'active' | 'scheduled';
  page?: number;
  limit?: number;
}
