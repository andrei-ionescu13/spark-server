export interface SearchReviewsRequestDto {
  keyword?: string;
  status?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}
