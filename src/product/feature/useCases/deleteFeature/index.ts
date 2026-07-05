import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { FeatureModel } from '../../model';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { DeleteFeatureController } from './deleteFeatureController';
import { DeleteFeatureUseCase } from './deleteFeatureUseCase';

const productQueriesRepo = new ProductQueriesRepo(ProductModel);
const featureCommandsRepo = new FeatureCommandsRepo(FeatureModel);
const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);

const deleteFeatureUseCase = new DeleteFeatureUseCase(
  productQueriesRepo,
  featureCommandsRepo,
  featureQueriesRepo,
);

export const deleteFeatureController = new DeleteFeatureController(deleteFeatureUseCase);
