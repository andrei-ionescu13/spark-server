import { KeyRepo } from '../../../key/keyRepo';
import { KeyModel } from '../../../key/model';
import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { ImportProductKeysController } from './importProductKeysController';
import { ImportProductKeysUseCase } from './importProductKeysUseCase';

const keyRepo = new KeyRepo(KeyModel);
const productRepo = new ProductRepo(ProductModel);
const importProductKeysUseCase = new ImportProductKeysUseCase(keyRepo, productRepo);
export const importProductKeysController = new ImportProductKeysController(
  importProductKeysUseCase,
);
