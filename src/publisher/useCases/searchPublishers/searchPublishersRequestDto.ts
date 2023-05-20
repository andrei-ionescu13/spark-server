export interface SearchPublishersRequestDto {
  keyword: string;
  sortBy: string;
  sortOrder: string;
  page?: number;
  limit?: number;
}
