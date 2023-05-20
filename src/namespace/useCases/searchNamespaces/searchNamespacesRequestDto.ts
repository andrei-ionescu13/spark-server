export interface SearchNamespacesRequestDto {
  searchFor?: string;
  languageCodes: any;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
