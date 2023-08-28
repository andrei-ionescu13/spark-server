import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { DeveloperRepo } from '../../developerRepo';
import { DeveloperModel } from '../../model';
import { DeleteDeveloperBulkController } from './deleteDeveloperBulkController';
import { DeleteDeveloperBulkUseCase } from './deleteDeveloperBulkUseCase';

const productRepo = new ProductRepo(ProductModel);
const developerRepo = new DeveloperRepo(DeveloperModel);
const deleteDeveloperBulkUseCase = new DeleteDeveloperBulkUseCase(productRepo, developerRepo);
export const deleteDeveloperBulkController = new DeleteDeveloperBulkController(
  deleteDeveloperBulkUseCase,
);
