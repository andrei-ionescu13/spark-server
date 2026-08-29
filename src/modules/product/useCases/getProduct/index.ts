import { Collection } from 'mongodb';
import { ProductRepo } from '../../productRepo';
import { ProductQueriesRepo } from '../../repo/queries';
import { GetProductController } from './getProductController';
import { GetProductUseCase } from './getProductUseCase';
import { Mongo } from '../../../../mongo';

const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));
const getProductUseCase = new GetProductUseCase(productQueriesRepo);
export const getProductController = new GetProductController(getProductUseCase);
