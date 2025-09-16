import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { ProductQueriesRepo } from '../../../product/repo/queries';
import { KeyModel } from '../../model';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { ImportKeysController } from './importKeysController';
import { ImportKeysUseCase } from './importKeysUseCase';

const keyCommandsRepo = new KeyCommandsRepo(KeyModel);
const keyQueriesRepo = new KeyQueriesRepo(KeyModel);
const productCommandsRepo = new ProductCommandsRepo(ProductModel);
const productQueriesRepo = new ProductQueriesRepo(ProductModel);

const importKeysUseCase = new ImportKeysUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
  productQueriesRepo,
);
export const importKeysController = new ImportKeysController(importKeysUseCase);
