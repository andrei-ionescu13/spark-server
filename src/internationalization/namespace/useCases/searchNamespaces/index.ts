import { LanguageModel } from '../../../language/model';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceModel } from '../../model';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { SearchNamespacesController } from './searchNamespacesController';
import { SearchNamespacesUseCase } from './searchNamespacesUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(NamespaceModel);
const languageQueriesRepo = new LanguageQueriesRepo(LanguageModel);

const searchNamespacesUseCase = new SearchNamespacesUseCase(
  namespaceQueriesRepo,
  languageQueriesRepo,
);
export const searchNamespacesController = new SearchNamespacesController(searchNamespacesUseCase);
