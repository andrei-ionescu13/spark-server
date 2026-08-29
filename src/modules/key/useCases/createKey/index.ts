import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { ProductQueriesRepo } from '../../../product/repo/queries';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { CreateKeyController } from './createKeyController';
import { CreateKeyUseCase } from './createKeyUseCase';

const keyCommandsRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
const keyQueriesRepo = new KeyQueriesRepo(Mongo.getCollection('keys'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));

const createKeyUseCase = new CreateKeyUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
  productQueriesRepo,
);
export const createKeyController = new CreateKeyController(createKeyUseCase);
