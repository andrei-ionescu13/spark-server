import { LanguageRepo } from '../../../language/languageRepo';
import { LanguageModel } from '../../../language/model';
import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { SearchTranslationsController } from './searchTranslationsController';
import { SearchTranslationsUseCase } from './searchTranslationsUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const languageRepo = new LanguageRepo(LanguageModel);
const searchTranslationsUseCase = new SearchTranslationsUseCase(namespaceRepo, languageRepo);
export const searchTranslationsController = new SearchTranslationsController(
  searchTranslationsUseCase,
);
