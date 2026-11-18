import { Mongo } from '../../../../../mongo';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { CreateNamespaceController } from './createNamespaceController';
import { CreateNamespaceUseCase } from './createNamespaceUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo();
const namespaceQueriesRepo = new NamespaceQueriesRepo();

const createNamespaceUseCase = new CreateNamespaceUseCase(
  namespaceCommandsRepo,
  namespaceQueriesRepo,
);
export const createNamespaceController = new CreateNamespaceController(createNamespaceUseCase);
