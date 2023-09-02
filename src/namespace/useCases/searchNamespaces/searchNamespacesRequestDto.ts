export interface SearchNamespacesRequestDto {
  searchFor?: string;
  translationsLanguageCodes: any;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
