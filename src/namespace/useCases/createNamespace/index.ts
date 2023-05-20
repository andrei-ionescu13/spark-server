import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { CreateNamespaceController } from './createNamespaceController';
import { CreateNamespaceUseCase } from './createNamespaceUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const createNamespaceUseCase = new CreateNamespaceUseCase(namespaceRepo);
export const createNamespaceController = new CreateNamespaceController(createNamespaceUseCase);
