export interface SearchNamespacesRequestDto {
  translationsLanguageCodes: any;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
