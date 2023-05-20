import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { UpdateNamespaceController } from './updateNamespaceController';
import { UpdateNamespaceUseCase } from './updateNamespaceUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const updateNamespaceUseCase = new UpdateNamespaceUseCase(namespaceRepo);
export const updateNamespaceController = new UpdateNamespaceController(updateNamespaceUseCase);
