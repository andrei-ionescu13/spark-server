export interface SearchDealsRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  page?: number;
  limit?: number;
}
