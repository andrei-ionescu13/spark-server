import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { FeatureModel } from '../../model';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { DeleteFeatureBulkController } from './deleteFeatureBulkController';
import { DeleteFeatureBulkUseCase } from './deleteFeaturerBulkUseCase';

const productQueriesRepo = new ProductQueriesRepo(ProductModel);
const featureCommandsRepo = new FeatureCommandsRepo(FeatureModel);
const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);

const deleteFeatureBulkUseCase = new DeleteFeatureBulkUseCase(
  productQueriesRepo,
  featureCommandsRepo,
  featureQueriesRepo,
);

export const deleteFeatureBulkController = new DeleteFeatureBulkController(
  deleteFeatureBulkUseCase,
);
