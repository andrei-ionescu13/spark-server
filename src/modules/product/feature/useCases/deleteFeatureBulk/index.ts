import { Mongo } from '../../../../../mongo';
import { ProductQueriesRepo } from '../../../repo/queries';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { DeleteFeatureBulkController } from './deleteFeatureBulkController';
import { DeleteFeatureBulkUseCase } from './deleteFeaturerBulkUseCase';

const productQueriesRepo = new ProductQueriesRepo();
const featureCommandsRepo = new FeatureCommandsRepo();
const featureQueriesRepo = new FeatureQueriesRepo();

const deleteFeatureBulkUseCase = new DeleteFeatureBulkUseCase(
  productQueriesRepo,
  featureCommandsRepo,
  featureQueriesRepo,
);

export const deleteFeatureBulkController = new DeleteFeatureBulkController(
  deleteFeatureBulkUseCase,
);
