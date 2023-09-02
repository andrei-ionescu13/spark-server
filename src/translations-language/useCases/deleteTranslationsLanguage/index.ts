import { TranslationsLanguageRepo } from '../../languageRepo';
import { TranslationsLanguageModel } from '../../model';
import { DeleteTranslationsLanguageController } from './deleteTranslationsLanguageController';
import { DeleteTranslationsLanguageUseCase } from './deleteTranslationsLanguageUseCase';

const translationsLanguageRepo = new TranslationsLanguageRepo(TranslationsLanguageModel);
const deleteTranslationsLanguageUseCase = new DeleteTranslationsLanguageUseCase(
  translationsLanguageRepo,
);
export const deleteTranslationsLanguageController = new DeleteTranslationsLanguageController(
  deleteTranslationsLanguageUseCase,
);
