import { KeyRepo } from './keyRepo';
import { KeyModel } from './model';
export { KeyModel } from './model';
export { keysController } from './controller';
export { keyServices } from './services';
export { default as keysRoutes } from './routes';
export { keyValidation } from './validation';

export const keyDb = new KeyRepo(KeyModel);
