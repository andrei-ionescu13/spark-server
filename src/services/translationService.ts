export interface TranslationServiceI {
  convertNamespacesToJson: (namespaces: Array<Record<string, any>>, code: string) => Record<string, Record<string, string>>;
}

export class TranslationService implements TranslationServiceI {
  convertNamespacesToJson = (namespaces: Array<Record<string, any>>, code: string) => {
    const translations = {};

    namespaces.forEach((namespace) => {
      translations[namespace.name] = {};
      namespace.translations.forEach((translation) => {
        translations[namespace.name][translation.key] = translation?.[code] || '';
      });
    });

    return translations;
  }
}