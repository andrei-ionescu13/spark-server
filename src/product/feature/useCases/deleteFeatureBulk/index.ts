import { ProductModel } from '../../../../../product/model';
import { ProductRepo } from '../../../../../product/productRepo';
import { FeatureModel } from '../../model';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { DeleteFeatureBulkController } from './deleteFeatureBulkController';
import { DeleteFeatureBulkUseCase } from './deleteFeaturerBulkUseCase';

const productRepo = new ProductRepo(ProductModel);
const featureCommandsRepo = new FeatureCommandsRepo(FeatureModel);
const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);

const deleteFeatureBulkUseCase = new DeleteFeatureBulkUseCase(
  productRepo,
  featureCommandsRepo,
  featureQueriesRepo,
);

export const deleteFeatureBulkController = new DeleteFeatureBulkController(
  deleteFeatureBulkUseCase,
);
