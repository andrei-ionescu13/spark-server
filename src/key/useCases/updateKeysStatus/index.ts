import { KeyRepo } from '../../keyRepo';
import { KeyModel } from '../../model';
import { UpdateKeysStatusController } from './updateKeysStatusController';
import { UpdateKeysStatusUseCase } from './updateKeysStatusUseCase';

const keyRepo = new KeyRepo(KeyModel);
const updateKeysStatusUseCase = new UpdateKeysStatusUseCase(keyRepo);
export const updateKeysStatusController = new UpdateKeysStatusController(updateKeysStatusUseCase);
