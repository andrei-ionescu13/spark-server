import { Mongo } from '../../../../mongo';
import { KeyQueriesRepo } from '../../repo/queries';
import { SearchKeysController } from './searchKeysController';
import { SearchKeysUseCase } from './searchKeysUseCase';

const keyQueriesRepo = new KeyQueriesRepo(Mongo.getCollection('keys'));
const searchKeysUseCase = new SearchKeysUseCase(keyQueriesRepo);
export const searchKeysController = new SearchKeysController(searchKeysUseCase);
