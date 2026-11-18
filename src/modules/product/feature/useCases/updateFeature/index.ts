import { Mongo } from '../../../../../mongo';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { UpdateFeatureController } from './updateFeatureController';
import { UpdateFeatureUseCase } from './updateFeatureUseCase';

const featureCommandsRepo = new FeatureCommandsRepo();
const featureQueriesRepo = new FeatureQueriesRepo();

const updateFeatureUseCase = new UpdateFeatureUseCase(featureCommandsRepo, featureQueriesRepo);

export const updateFeatureController = new UpdateFeatureController(updateFeatureUseCase);
