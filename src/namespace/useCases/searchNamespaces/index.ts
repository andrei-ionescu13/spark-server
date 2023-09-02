import { TranslationsLanguageRepo } from '../../../translations-language/languageRepo';
import { TranslationsLanguageModel } from '../../../translations-language/model';
import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { SearchNamespacesController } from './searchNamespacesController';
import { SearchNamespacesUseCase } from './searchNamespacesUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const translationsLanguageRepo = new TranslationsLanguageRepo(TranslationsLanguageModel);
const searchNamespacesUseCase = new SearchNamespacesUseCase(
  namespaceRepo,
  translationsLanguageRepo,
);
export const searchNamespacesController = new SearchNamespacesController(searchNamespacesUseCase);
