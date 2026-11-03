import { Mongo } from '../../../../../mongo';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { CreateNamespaceController } from './createNamespaceController';
import { CreateNamespaceUseCase } from './createNamespaceUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(Mongo.getCollection('namespaces'));
const namespaceQueriesRepo = new NamespaceQueriesRepo(Mongo.getCollection('namespaces'));

const createNamespaceUseCase = new CreateNamespaceUseCase(
  namespaceCommandsRepo,
  namespaceQueriesRepo,
);
export const createNamespaceController = new CreateNamespaceController(createNamespaceUseCase);
