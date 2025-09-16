export interface UpdateTranslationRequestDto {
  namespaceId: string;
  key: string;
  [key: string]: string;
}
