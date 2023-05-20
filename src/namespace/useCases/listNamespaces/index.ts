import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { ListNamespacesController } from './listNamespacesController';
import { ListNamespacesUseCase } from './listNamespacesUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const listNamespacesUseCase = new ListNamespacesUseCase(namespaceRepo);
export const listNamespacesController = new ListNamespacesController(listNamespacesUseCase);
