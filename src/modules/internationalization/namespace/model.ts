export interface NamespaceDoc {
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  translations: Array<{
    key: string;
    [key: string]: string;
  }>;
  _id: string;
}

export interface TranslationDoc {
  key: string;
  [lang: string]: string;
}
