import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { KeyCommandsRepo } from '../../repo/commands';
import { KeyQueriesRepo } from '../../repo/queries';
import { DeleteKeyController } from './deleteKeyController';
import { DeleteKeyUseCase } from './deleteKeyUseCase';

const keyCommandsRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
const keyQueriesRepo = new KeyQueriesRepo(Mongo.getCollection('keys'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('keys'));

const deleteKeyUseCase = new DeleteKeyUseCase(keyCommandsRepo, keyQueriesRepo, productCommandsRepo);
export const deleteKeyController = new DeleteKeyController(deleteKeyUseCase);
