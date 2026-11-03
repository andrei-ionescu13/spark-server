export interface UpdateTranslationRequestDto {
  namespaceId: string;
  key: string;
  keyValue: string;
  [key: string]: string;
}
