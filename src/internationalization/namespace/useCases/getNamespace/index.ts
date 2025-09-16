import { NamespaceModel } from '../../model';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { GetNamespaceController } from './getNamespaceController';
import { GetNamespaceUseCase } from './getNamespaceUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(NamespaceModel);
const getNamespaceUseCase = new GetNamespaceUseCase(namespaceQueriesRepo);
export const getNamespaceController = new GetNamespaceController(getNamespaceUseCase);
