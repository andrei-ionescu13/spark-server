import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { DeveloperRepo } from '../../developerRepo';
import { DeveloperModel } from '../../model';
import { DeleteDeveloperController } from './deleteDeveloperController';
import { DeleteDeveloperUseCase } from './deleteDeveloperUseCase';

const productRepo = new ProductRepo(ProductModel);
const developerRepo = new DeveloperRepo(DeveloperModel);

const deleteDeveloperUseCase = new DeleteDeveloperUseCase(productRepo, developerRepo);
export const deleteDeveloperController = new DeleteDeveloperController(deleteDeveloperUseCase);
