import { KeyModel } from '../../model';
import { KeyQueriesRepo } from '../../repo/queries';
import { SearchKeysController } from './searchKeysController';
import { SearchKeysUseCase } from './searchKeysUseCase';

const keyQueriesRepo = new KeyQueriesRepo(KeyModel);
const searchKeysUseCase = new SearchKeysUseCase(keyQueriesRepo);
export const searchKeysController = new SearchKeysController(searchKeysUseCase);
