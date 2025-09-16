import { FeatureModel } from '../../model';
import { FeatureQueriesRepo } from '../../repo/queries';
import { ListFeaturesController } from './listFeaturesController';
import { ListFeaturesUseCase } from './listFeaturesUseCase';

const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);

const listFeaturesUseCase = new ListFeaturesUseCase(featureQueriesRepo);

export const listFeaturesController = new ListFeaturesController(listFeaturesUseCase);
