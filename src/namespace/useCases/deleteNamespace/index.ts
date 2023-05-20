import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { DeleteNamespaceController } from './deleteNamespaceController';
import { DeleteNamespaceUseCase } from './deleteNamespaceUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const deleteNamespaceUseCase = new DeleteNamespaceUseCase(namespaceRepo);
export const deleteNamespaceController = new DeleteNamespaceController(deleteNamespaceUseCase);
