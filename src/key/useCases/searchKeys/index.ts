import { KeyRepo } from '../../keyRepo';
import { KeyModel } from '../../model';
import { SearchKeysController } from './searchKeysController';
import { SearchKeysUseCase } from './searchKeysUseCase';

const keyRepo = new KeyRepo(KeyModel);
const searchKeysUseCase = new SearchKeysUseCase(keyRepo);
export const searchKeysController = new SearchKeysController(searchKeysUseCase);
