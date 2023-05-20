import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { KeyRepo } from '../../keyRepo';
import { KeyModel } from '../../model';
import { DeleteKeyController } from './deleteKeyController';
import { DeleteKeyUseCase } from './deleteKeyUseCase';

const keyRepo = new KeyRepo(KeyModel);
const productRepo = new ProductRepo(ProductModel);
const deleteKeyUseCase = new DeleteKeyUseCase(keyRepo, productRepo);
export const deleteKeyController = new DeleteKeyController(deleteKeyUseCase);
