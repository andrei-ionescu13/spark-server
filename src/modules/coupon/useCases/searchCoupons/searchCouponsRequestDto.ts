export interface SearchCouponsRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status?: 'expired' | 'active' | 'scheduled';
}
