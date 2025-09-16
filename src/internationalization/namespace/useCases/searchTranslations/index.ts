import { LanguageModel } from '../../../language/model';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceModel } from '../../model';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { SearchTranslationsController } from './searchTranslationsController';
import { SearchTranslationsUseCase } from './searchTranslationsUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(NamespaceModel);
const languageQueriesRepo = new LanguageQueriesRepo(LanguageModel);

const searchTranslationsUseCase = new SearchTranslationsUseCase(
  namespaceQueriesRepo,
  languageQueriesRepo,
);

export const searchTranslationsController = new SearchTranslationsController(
  searchTranslationsUseCase,
);
