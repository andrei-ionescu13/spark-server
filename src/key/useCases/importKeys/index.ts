import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { KeyRepo } from '../../keyRepo';
import { KeyModel } from '../../model';
import { ImportKeysController } from './importKeysController';
import { ImportKeysUseCase } from './importKeysUseCase';

const keyRepo = new KeyRepo(KeyModel);
const productRepo = new ProductRepo(ProductModel);
const importKeysUseCase = new ImportKeysUseCase(keyRepo, productRepo);
export const importKeysController = new ImportKeysController(importKeysUseCase);
