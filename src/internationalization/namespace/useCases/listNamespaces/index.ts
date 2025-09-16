import { NamespaceModel } from '../../model';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { ListNamespacesController } from './listNamespacesController';
import { ListNamespacesUseCase } from './listNamespacesUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(NamespaceModel);
const listNamespacesUseCase = new ListNamespacesUseCase(namespaceQueriesRepo);
export const listNamespacesController = new ListNamespacesController(listNamespacesUseCase);
