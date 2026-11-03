import { Mongo } from '../../../../../mongo';
import { FeatureCommandsRepo } from '../../repo/commands';
import { FeatureQueriesRepo } from '../../repo/queries';
import { CreateFeatureController } from './createFeatureController';
import { CreateFeatureUseCase } from './createFeatureUseCase';

const featureCommandsRepo = new FeatureCommandsRepo(Mongo.getCollection('features'));
const featureQueriesRepo = new FeatureQueriesRepo(Mongo.getCollection('features'));

const createFeatureUseCase = new CreateFeatureUseCase(featureCommandsRepo, featureQueriesRepo);

export const createFeatureController = new CreateFeatureController(createFeatureUseCase);
