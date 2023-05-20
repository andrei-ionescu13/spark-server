export interface SearchTranslationsRequestDto {
  namespaceId: string;
  languageCodes?: any;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
