export interface SearchReviewsRequestDto {
  keyword?: string;
  status?: 'published' | 'unpublished' | 'flagged';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  sortBy?: string;
}
