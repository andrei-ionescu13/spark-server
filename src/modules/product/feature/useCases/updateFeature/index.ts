import { Mongo } from '../../../../../mongo';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { UpdateFeatureController } from './updateFeatureController';
import { UpdateFeatureUseCase } from './updateFeatureUseCase';

const featureCommandsRepo = new FeatureCommandsRepo(Mongo.getCollection('features'));
const featureQueriesRepo = new FeatureQueriesRepo(Mongo.getCollection('features'));

const updateFeatureUseCase = new UpdateFeatureUseCase(featureCommandsRepo, featureQueriesRepo);

export const updateFeatureController = new UpdateFeatureController(updateFeatureUseCase);
