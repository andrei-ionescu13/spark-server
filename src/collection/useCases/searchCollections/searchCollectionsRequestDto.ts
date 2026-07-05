export interface SearchCollectionsRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: 'expired' | 'active' | 'scheduled';
  page?: number;
  limit?: number;
}
