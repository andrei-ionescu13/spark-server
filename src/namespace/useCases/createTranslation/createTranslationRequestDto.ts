export interface CreateTranslationRequestDto {
  namespaceId: string;
  key: string;
  [key: string]: string;
}
