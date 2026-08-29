import { Mongo } from '../../../../../mongo';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { GetNamespaceController } from './getNamespaceController';
import { GetNamespaceUseCase } from './getNamespaceUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(Mongo.getCollection('namespaces'));
const getNamespaceUseCase = new GetNamespaceUseCase(namespaceQueriesRepo);
export const getNamespaceController = new GetNamespaceController(getNamespaceUseCase);
