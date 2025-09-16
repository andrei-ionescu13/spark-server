export interface SearchDiscountsRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  page?: number;
  limit?: number;
}
