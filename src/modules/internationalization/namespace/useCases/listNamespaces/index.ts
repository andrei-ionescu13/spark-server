import { Mongo } from '../../../../../mongo';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { ListNamespacesController } from './listNamespacesController';
import { ListNamespacesUseCase } from './listNamespacesUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(Mongo.getCollection('namespaces'));
const listNamespacesUseCase = new ListNamespacesUseCase(namespaceQueriesRepo);
export const listNamespacesController = new ListNamespacesController(listNamespacesUseCase);
