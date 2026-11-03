import { Mongo } from '../../../../../mongo';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { SearchTranslationsController } from './searchTranslationsController';
import { SearchTranslationsUseCase } from './searchTranslationsUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(Mongo.getCollection('namespaces'));
const languageQueriesRepo = new LanguageQueriesRepo(Mongo.getCollection('languages'));

const searchTranslationsUseCase = new SearchTranslationsUseCase(
  namespaceQueriesRepo,
  languageQueriesRepo,
);

export const searchTranslationsController = new SearchTranslationsController(
  searchTranslationsUseCase,
);
