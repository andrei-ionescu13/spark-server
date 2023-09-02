import { TranslationsLanguageRepo } from '../../languageRepo';
import { TranslationsLanguageModel } from '../../model';
import { AddTranslationsLanguageController } from './addTranslationsLanguageController';
import { AddTranslationsLanguageUseCase } from './addTranslationsLanguageUseCase';

const translationsLanguageRepo = new TranslationsLanguageRepo(TranslationsLanguageModel);
const addTranslationsLanguageUseCase = new AddTranslationsLanguageUseCase(translationsLanguageRepo);
export const addTranslationsLanguageController = new AddTranslationsLanguageController(
  addTranslationsLanguageUseCase,
);
