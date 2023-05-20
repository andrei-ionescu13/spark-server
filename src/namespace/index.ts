import { NamespaceModel } from './model';
import { NamespaceRepo } from './namespaceRepo';

export { default as namespaceRoutes } from './routes';

export const namespaceDb = new NamespaceRepo(NamespaceModel);
