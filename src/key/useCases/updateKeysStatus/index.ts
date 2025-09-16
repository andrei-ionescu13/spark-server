import { KeyModel } from '../../model';
import { KeyCommandsRepo } from '../../repo/commands';
import { UpdateKeysStatusController } from './updateKeysStatusController';
import { UpdateKeysStatusUseCase } from './updateKeysStatusUseCase';

const keyCommandsRepo = new KeyCommandsRepo(KeyModel);
const updateKeysStatusUseCase = new UpdateKeysStatusUseCase(keyCommandsRepo);
export const updateKeysStatusController = new UpdateKeysStatusController(updateKeysStatusUseCase);
