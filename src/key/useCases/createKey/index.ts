import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { ProductQueriesRepo } from '../../../product/repo/queries';
import { KeyModel } from '../../model';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { CreateKeyController } from './createKeyController';
import { CreateKeyUseCase } from './createKeyUseCase';

const keyCommandsRepo = new KeyCommandsRepo(KeyModel);
const keyQueriesRepo = new KeyQueriesRepo(KeyModel);
const productCommandsRepo = new ProductCommandsRepo(ProductModel);
const productQueriesRepo = new ProductQueriesRepo(ProductModel);

const createKeyUseCase = new CreateKeyUseCase(
  keyCommandsRepo,
  keyQueriesRepo,
  productCommandsRepo,
  productQueriesRepo,
);
export const createKeyController = new CreateKeyController(createKeyUseCase);
