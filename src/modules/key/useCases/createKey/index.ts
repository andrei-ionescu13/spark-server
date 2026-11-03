import { Mongo } from '../../../../mongo';
import { ProductKeyCreationChecker } from '../../../../productKeyCreationChecker';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { ProductQueriesRepo } from '../../../product/repo/queries';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { CreateKeyController } from './createKeyController';
import { CreateKeyUseCase } from './createKeyUseCase';

const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const keyCommandsRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
const productKeyCreationChecker = new ProductKeyCreationChecker(
  productCommandsRepo,
  keyCommandsRepo,
);

const createKeyUseCase = new CreateKeyUseCase(
  productCommandsRepo,
  keyCommandsRepo,
  productKeyCreationChecker,
);
export const createKeyController = new CreateKeyController(createKeyUseCase);
