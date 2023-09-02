import { TranslationsLanguageRepo } from '../../../translations-language/languageRepo';
import { TranslationsLanguageModel } from '../../../translations-language/model';
import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { SearchTranslationsController } from './searchTranslationsController';
import { SearchTranslationsUseCase } from './searchTranslationsUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const translationsLanguageRepo = new TranslationsLanguageRepo(TranslationsLanguageModel);
const searchTranslationsUseCase = new SearchTranslationsUseCase(
  namespaceRepo,
  translationsLanguageRepo,
);
export const searchTranslationsController = new SearchTranslationsController(
  searchTranslationsUseCase,
);
