import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { KeyRepo } from '../../keyRepo';
import { KeyModel } from '../../model';
import { DeleteKeysBulkController } from './deleteKeysBulkController';
import { DeleteKeysBulkUseCase } from './deleteKeysBulkUseCase';

const keyRepo = new KeyRepo(KeyModel);
const productRepo = new ProductRepo(ProductModel);
const deleteKeysBulkUseCase = new DeleteKeysBulkUseCase(keyRepo, productRepo);
export const deleteKeysBulkController = new DeleteKeysBulkController(deleteKeysBulkUseCase);
