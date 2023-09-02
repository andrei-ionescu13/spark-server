export interface SearchArticleCategoriesRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
