import { ProductModel } from '../../../../../product/model';
import { ProductRepo } from '../../../../../product/productRepo';
import { FeatureModel } from '../../model';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { DeleteFeatureController } from './deleteFeatureController';
import { DeleteFeatureUseCase } from './deleteFeatureUseCase';

const productRepo = new ProductRepo(ProductModel);
const featureCommandsRepo = new FeatureCommandsRepo(FeatureModel);
const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);

const deleteFeatureUseCase = new DeleteFeatureUseCase(
  productRepo,
  featureCommandsRepo,
  featureQueriesRepo,
);
export const deleteFeatureController = new DeleteFeatureController(deleteFeatureUseCase);
