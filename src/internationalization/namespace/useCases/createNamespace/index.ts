import { NamespaceModel } from '../../model';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { CreateNamespaceController } from './createNamespaceController';
import { CreateNamespaceUseCase } from './createNamespaceUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(NamespaceModel);
const namespaceQueriesRepo = new NamespaceQueriesRepo(NamespaceModel);

const createNamespaceUseCase = new CreateNamespaceUseCase(
  namespaceCommandsRepo,
  namespaceQueriesRepo,
);
export const createNamespaceController = new CreateNamespaceController(createNamespaceUseCase);
