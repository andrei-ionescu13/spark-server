import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { KeyModel } from '../../model';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { DeleteKeysBulkController } from './deleteKeysBulkController';
import { DeleteKeysBulkUseCase } from './deleteKeysBulkUseCase';

const keyCommandsRepo = new KeyCommandsRepo(KeyModel);
const keyQueriesRepo = new KeyQueriesRepo(KeyModel);
const productCommandsRepo = new ProductCommandsRepo(ProductModel);

const deleteKeysBulkUseCase = new DeleteKeysBulkUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
);
export const deleteKeysBulkController = new DeleteKeysBulkController(deleteKeysBulkUseCase);
