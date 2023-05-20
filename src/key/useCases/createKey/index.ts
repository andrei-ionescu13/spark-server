import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { KeyRepo } from '../../keyRepo';
import { KeyModel } from '../../model';
import { CreateKeyController } from './createKeyController';
import { CreateKeyUseCase } from './createKeyUseCase';

const keyRepo = new KeyRepo(KeyModel);
const productRepo = new ProductRepo(ProductModel);
const createKeyUseCase = new CreateKeyUseCase(keyRepo, productRepo);
export const createKeyController = new CreateKeyController(createKeyUseCase);
