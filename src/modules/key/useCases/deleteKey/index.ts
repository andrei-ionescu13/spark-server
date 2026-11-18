import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { DeleteKeyController } from './deleteKeyController';
import { DeleteKeyUseCase } from './deleteKeyUseCase';

const keyCommandsRepo = new KeyCommandsRepo();
const keyQueriesRepo = new KeyQueriesRepo();
const productCommandsRepo = new ProductCommandsRepo();

const deleteKeyUseCase = new DeleteKeyUseCase(keyCommandsRepo, keyQueriesRepo, productCommandsRepo);
export const deleteKeyController = new DeleteKeyController(deleteKeyUseCase);
