import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { DeleteKeysBulkController } from './deleteKeysBulkController';
import { DeleteKeysBulkUseCase } from './deleteKeysBulkUseCase';

const keyCommandsRepo = new KeyCommandsRepo();
const keyQueriesRepo = new KeyQueriesRepo();
const productCommandsRepo = new ProductCommandsRepo();

const deleteKeysBulkUseCase = new DeleteKeysBulkUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
);
export const deleteKeysBulkController = new DeleteKeysBulkController(deleteKeysBulkUseCase);
