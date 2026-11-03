export interface SearchProductReviewsRequestDto {
  productId: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  page?: number;
  limit?: number;
}
