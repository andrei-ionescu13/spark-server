import { Mongo } from '../../../../../mongo';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { SearchNamespacesController } from './searchNamespacesController';
import { SearchNamespacesUseCase } from './searchNamespacesUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo();
const languageQueriesRepo = new LanguageQueriesRepo();

const searchNamespacesUseCase = new SearchNamespacesUseCase(
  namespaceQueriesRepo,
  languageQueriesRepo,
);
export const searchNamespacesController = new SearchNamespacesController(searchNamespacesUseCase);
