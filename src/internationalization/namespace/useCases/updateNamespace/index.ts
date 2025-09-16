import { NamespaceModel } from '../../model';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { UpdateNamespaceController } from './updateNamespaceController';
import { UpdateNamespaceUseCase } from './updateNamespaceUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(NamespaceModel);
const updateNamespaceUseCase = new UpdateNamespaceUseCase(namespaceCommandsRepo);
export const updateNamespaceController = new UpdateNamespaceController(updateNamespaceUseCase);
