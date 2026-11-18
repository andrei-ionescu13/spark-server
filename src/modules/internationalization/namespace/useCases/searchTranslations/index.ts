import { Mongo } from '../../../../../mongo';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { SearchTranslationsController } from './searchTranslationsController';
import { SearchTranslationsUseCase } from './searchTranslationsUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo();
const languageQueriesRepo = new LanguageQueriesRepo();

const searchTranslationsUseCase = new SearchTranslationsUseCase(
  namespaceQueriesRepo,
  languageQueriesRepo,
);

export const searchTranslationsController = new SearchTranslationsController(
  searchTranslationsUseCase,
);
