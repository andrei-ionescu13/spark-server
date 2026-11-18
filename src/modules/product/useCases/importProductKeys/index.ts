import { Mongo } from '../../../../mongo';
import { KeyCommandsRepo } from '../../../key/repo/commands';
import { KeyQueriesRepo } from '../../../key/repo/queries';
import { ProductCommandsRepo } from '../../repo/commands';
import { ProductQueriesRepo } from '../../repo/queries';
import { ImportProductKeysController } from './importProductKeysController';
import { ImportProductKeysUseCase } from './importProductKeysUseCase';

const keyCommandsRepo = new KeyCommandsRepo();
const keyQueriesRepo = new KeyQueriesRepo();
const productCommandsRepo = new ProductCommandsRepo();
const productQueriesRepo = new ProductQueriesRepo();
const importProductKeysUseCase = new ImportProductKeysUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
  productQueriesRepo,
);
export const importProductKeysController = new ImportProductKeysController(
  importProductKeysUseCase,
);
