import { NamespaceModel } from '../../model';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { DeleteNamespaceController } from './deleteNamespaceController';
import { DeleteNamespaceUseCase } from './deleteNamespaceUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(NamespaceModel);
const namespaceQueriesRepo = new NamespaceQueriesRepo(NamespaceModel);

const deleteNamespaceUseCase = new DeleteNamespaceUseCase(
  namespaceCommandsRepo,
  namespaceQueriesRepo,
);
export const deleteNamespaceController = new DeleteNamespaceController(deleteNamespaceUseCase);
