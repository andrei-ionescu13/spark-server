export interface SearchCurrenciesRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
