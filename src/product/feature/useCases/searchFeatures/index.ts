import { FeatureModel } from '../../model';
import { FeatureQueriesRepo } from '../../repo/queries';
import { SearchFeatureController } from './searchFeaturesController';
import { SearchFeaturesUseCase } from './searchFeaturesUseCase';

const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);

const searchFeaturesUseCase = new SearchFeaturesUseCase(featureQueriesRepo);

export const searchFeatureController = new SearchFeatureController(searchFeaturesUseCase);
