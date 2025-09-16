import { FeatureModel } from '../../model';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { CreateFeatureController } from './createFeatureController';
import { CreateFeatureUseCase } from './createFeatureUseCase';

const featureCommandsRepo = new FeatureCommandsRepo(FeatureModel);
const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);

const createFeatureUseCase = new CreateFeatureUseCase(featureCommandsRepo, featureQueriesRepo);

export const createFeatureController = new CreateFeatureController(createFeatureUseCase);
