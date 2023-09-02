import { TranslationsLanguageRepo } from '../../languageRepo';
import { TranslationsLanguageModel } from '../../model';
import { ListTranslationsLanguagesController } from './listTranslationsLanguagesController';
import { ListTranslationsLanguagesUseCase } from './listTranslationsLanguagesUseCase';

const translationsLanguageRepo = new TranslationsLanguageRepo(TranslationsLanguageModel);
const listTranslationsLanguagesUseCase = new ListTranslationsLanguagesUseCase(
  translationsLanguageRepo,
);
export const listTranslationsLanguagesController = new ListTranslationsLanguagesController(
  listTranslationsLanguagesUseCase,
);
