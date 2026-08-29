import { Mongo } from '../../../../../mongo';
import { FeatureQueriesRepo } from '../../repo/queries';
import { ListFeaturesController } from './listFeaturesController';
import { ListFeaturesUseCase } from './listFeaturesUseCase';

const featureQueriesRepo = new FeatureQueriesRepo(Mongo.getCollection('features'));

const listFeaturesUseCase = new ListFeaturesUseCase(featureQueriesRepo);

export const listFeaturesController = new ListFeaturesController(listFeaturesUseCase);
