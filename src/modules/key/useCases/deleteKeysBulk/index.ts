import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { DeleteKeysBulkController } from './deleteKeysBulkController';
import { DeleteKeysBulkUseCase } from './deleteKeysBulkUseCase';

const keyCommandsRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
const keyQueriesRepo = new KeyQueriesRepo(Mongo.getCollection('keys'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));

const deleteKeysBulkUseCase = new DeleteKeysBulkUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
);
export const deleteKeysBulkController = new DeleteKeysBulkController(deleteKeysBulkUseCase);
