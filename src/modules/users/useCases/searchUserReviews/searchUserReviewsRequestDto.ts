export interface SearchUserReviewsRequestDto {
  userId: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  page?: number;
  limit?: number;
}
