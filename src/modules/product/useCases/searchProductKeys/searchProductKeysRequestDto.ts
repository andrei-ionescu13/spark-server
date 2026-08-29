export interface SearchProductKeysRequestDto {
  productId: string;
  keyword?: string;
  status?: string;
  page?: number;
  limit?: number;
}
