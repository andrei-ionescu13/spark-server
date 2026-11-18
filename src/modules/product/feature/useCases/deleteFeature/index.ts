import { Mongo } from '../../../../../mongo';
import { ProductQueriesRepo } from '../../../repo/queries';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { DeleteFeatureController } from './deleteFeatureController';
import { DeleteFeatureUseCase } from './deleteFeatureUseCase';

const productQueriesRepo = new ProductQueriesRepo();
const featureCommandsRepo = new FeatureCommandsRepo();
const featureQueriesRepo = new FeatureQueriesRepo();

const deleteFeatureUseCase = new DeleteFeatureUseCase(
  productQueriesRepo,
  featureCommandsRepo,
  featureQueriesRepo,
);

export const deleteFeatureController = new DeleteFeatureController(deleteFeatureUseCase);
