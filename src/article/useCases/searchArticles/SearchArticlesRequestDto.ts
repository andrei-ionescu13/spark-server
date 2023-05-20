export interface SearchArticlesRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}
