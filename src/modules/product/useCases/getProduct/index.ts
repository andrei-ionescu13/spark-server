import { Collection } from 'mongodb';
import { ProductQueriesRepo } from '../../repo/queries';
import { GetProductController } from './getProductController';
import { GetProductUseCase } from './getProductUseCase';
import { Mongo } from '../../../../mongo';

const productQueriesRepo = new ProductQueriesRepo();
const getProductUseCase = new GetProductUseCase(productQueriesRepo);
export const getProductController = new GetProductController(getProductUseCase);
