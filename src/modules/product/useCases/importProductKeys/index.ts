import { Mongo } from '../../../../mongo';
import { KeyCommandsRepo } from '../../../key/repo/commands';
import { KeyQueriesRepo } from '../../../key/repo/queries';
import { ProductRepo } from '../../productRepo';
import { ProductCommandsRepo } from '../../repo/commands';
import { ProductQueriesRepo } from '../../repo/queries';
import { ImportProductKeysController } from './importProductKeysController';
import { ImportProductKeysUseCase } from './importProductKeysUseCase';

const keyCommandsRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
const keyQueriesRepo = new KeyQueriesRepo(Mongo.getCollection('keys'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));
const importProductKeysUseCase = new ImportProductKeysUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
  productQueriesRepo,
);
export const importProductKeysController = new ImportProductKeysController(
  importProductKeysUseCase,
);
