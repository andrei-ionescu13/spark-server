import { Mongo } from '../../../../../mongo';
import { FeatureQueriesRepo } from '../../repo/queries';
import { SearchFeatureController } from './searchFeaturesController';
import { SearchFeaturesUseCase } from './searchFeaturesUseCase';

const featureQueriesRepo = new FeatureQueriesRepo(Mongo.getCollection('features'));

const searchFeaturesUseCase = new SearchFeaturesUseCase(featureQueriesRepo);

export const searchFeatureController = new SearchFeatureController(searchFeaturesUseCase);
