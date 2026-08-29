import { Mongo } from '../../../../../mongo';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { DeleteNamespaceController } from './deleteNamespaceController';
import { DeleteNamespaceUseCase } from './deleteNamespaceUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(Mongo.getCollection('namespaces'));
const namespaceQueriesRepo = new NamespaceQueriesRepo(Mongo.getCollection('namespaces'));

const deleteNamespaceUseCase = new DeleteNamespaceUseCase(
  namespaceCommandsRepo,
  namespaceQueriesRepo,
);
export const deleteNamespaceController = new DeleteNamespaceController(deleteNamespaceUseCase);
