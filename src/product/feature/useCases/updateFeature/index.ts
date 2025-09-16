import { FeatureModel } from '../../model';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { UpdateFeatureController } from './updateFeatureController';
import { UpdateFeatureUseCase } from './updateFeatureUseCase';

const featureCommandsRepo = new FeatureCommandsRepo(FeatureModel);
const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);

const updateFeatureUseCase = new UpdateFeatureUseCase(featureCommandsRepo, featureQueriesRepo);

export const updateFeatureController = new UpdateFeatureController(updateFeatureUseCase);
