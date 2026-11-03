import { Mongo } from '../../../../../mongo';
import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { DeleteFeatureBulkController } from './deleteFeatureBulkController';
import { DeleteFeatureBulkUseCase } from './deleteFeaturerBulkUseCase';

const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));
const featureCommandsRepo = new FeatureCommandsRepo(Mongo.getCollection('features'));
const featureQueriesRepo = new FeatureQueriesRepo(Mongo.getCollection('features'));

const deleteFeatureBulkUseCase = new DeleteFeatureBulkUseCase(
  productQueriesRepo,
  featureCommandsRepo,
  featureQueriesRepo,
);

export const deleteFeatureBulkController = new DeleteFeatureBulkController(
  deleteFeatureBulkUseCase,
);
