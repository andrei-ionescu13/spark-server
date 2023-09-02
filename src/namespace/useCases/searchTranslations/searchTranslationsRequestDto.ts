export interface SearchTranslationsRequestDto {
  namespaceId: string;
  translationsLanguageCodes?: any;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
