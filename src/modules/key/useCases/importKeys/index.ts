import { Mongo } from '../../../../mongo';
import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { ProductQueriesRepo } from '../../../product/repo/queries';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { ImportKeysController } from './importKeysController';
import { ImportKeysUseCase } from './importKeysUseCase';

const keyCommandsRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
const keyQueriesRepo = new KeyQueriesRepo(Mongo.getCollection('keys'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));

const importKeysUseCase = new ImportKeysUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
  productQueriesRepo,
);
export const importKeysController = new ImportKeysController(importKeysUseCase);
