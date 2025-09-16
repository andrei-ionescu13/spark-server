import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { KeyModel } from '../../model';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { DeleteKeyController } from './deleteKeyController';
import { DeleteKeyUseCase } from './deleteKeyUseCase';

const keyCommandsRepo = new KeyCommandsRepo(KeyModel);
const keyQueriesRepo = new KeyQueriesRepo(KeyModel);
const productCommandsRepo = new ProductCommandsRepo(ProductModel);

const deleteKeyUseCase = new DeleteKeyUseCase(keyCommandsRepo, keyQueriesRepo, productCommandsRepo);
export const deleteKeyController = new DeleteKeyController(deleteKeyUseCase);
