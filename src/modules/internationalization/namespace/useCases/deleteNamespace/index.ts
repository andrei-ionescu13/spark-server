import { Mongo } from '../../../../../mongo';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { DeleteNamespaceController } from './deleteNamespaceController';
import { DeleteNamespaceUseCase } from './deleteNamespaceUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo();
const namespaceQueriesRepo = new NamespaceQueriesRepo();

const deleteNamespaceUseCase = new DeleteNamespaceUseCase(
  namespaceCommandsRepo,
  namespaceQueriesRepo,
);
export const deleteNamespaceController = new DeleteNamespaceController(deleteNamespaceUseCase);
