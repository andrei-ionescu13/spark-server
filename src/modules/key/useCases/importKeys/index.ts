import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { ProductQueriesRepo } from '../../../product/repo/queries';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { ImportKeysController } from './importKeysController';
import { ImportKeysUseCase } from './importKeysUseCase';

const keyCommandsRepo = new KeyCommandsRepo();
const keyQueriesRepo = new KeyQueriesRepo();
const productCommandsRepo = new ProductCommandsRepo();
const productQueriesRepo = new ProductQueriesRepo();

const importKeysUseCase = new ImportKeysUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
  productQueriesRepo,
);
export const importKeysController = new ImportKeysController(importKeysUseCase);
