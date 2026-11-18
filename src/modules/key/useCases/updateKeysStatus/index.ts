import { Mongo } from '../../../../mongo';
import { KeyCommandsRepo } from '../../repo/commands';
import { UpdateKeysStatusController } from './updateKeysStatusController';
import { UpdateKeysStatusUseCase } from './updateKeysStatusUseCase';

const keyCommandsRepo = new KeyCommandsRepo();
const updateKeysStatusUseCase = new UpdateKeysStatusUseCase(keyCommandsRepo);
export const updateKeysStatusController = new UpdateKeysStatusController(updateKeysStatusUseCase);
