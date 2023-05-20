import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { GetNamespaceController } from './getNamespaceController';
import { GetNamespaceUseCase } from './getNamespaceUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const getNamespaceUseCase = new GetNamespaceUseCase(namespaceRepo);
export const getNamespaceController = new GetNamespaceController(getNamespaceUseCase);
