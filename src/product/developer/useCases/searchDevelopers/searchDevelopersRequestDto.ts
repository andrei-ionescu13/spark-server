export interface SearchDevelopersRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
