import { Mongo } from '../../../../../mongo';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { UpdateNamespaceController } from './updateNamespaceController';
import { UpdateNamespaceUseCase } from './updateNamespaceUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(Mongo.getCollection('namespaces'));
const updateNamespaceUseCase = new UpdateNamespaceUseCase(namespaceCommandsRepo);
export const updateNamespaceController = new UpdateNamespaceController(updateNamespaceUseCase);
